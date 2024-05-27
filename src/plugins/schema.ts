import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { GraphQLSchema } from 'graphql'
import { GraphQLError, buildSchema } from 'graphql'
import { join } from 'path'
import { addResolversToSchema } from '@graphql-tools/schema'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { stitchSchemas } from '@graphql-tools/stitch'
import type { SubschemaConfig, Transform } from '@graphql-tools/delegate'
import { schemaFromExecutor } from '@graphql-tools/wrap'
import resolvers from '../resolvers'
import type { PipelineStage, Types } from 'mongoose'
import type { GraphQL } from '../@types'
import { loansWithLatestFramePerSource } from '../aggregations'
import { JSONResolver } from 'graphql-scalars'
import { validatePipeline } from '../helpers/validators'
import type { Schema } from '../@types/schema'
import { ApiError, SubqueryTransform } from '../helpers'
import { buildHTTPExecutor } from '@graphql-tools/executor-http'
import { SUBQL_ENDPOINT, SUBQL_TIMEOUT } from '../config'

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Schema plugin registering...')

    const loadStaticSchema = async function (): Promise<GraphQLSchema> {
      // read graphql schemas from files
      const schema = await loadSchema(join(__dirname, '../schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] })

      // return schema with imported resolvers added
      return addResolversToSchema({ schema, resolvers })
    }

    server.log.debug('Load graphQL schema and resolvers')
    // load static schema
    const staticSchema = await loadStaticSchema()
    server.log.debug('Shared static schema loaded')

    const loadAggregationsSchema = async function (poolEntityId: Types.ObjectId): Promise<GraphQLSchema | undefined> {
      // query pool meta data with predefined aggregations
      // const poolEntity = (await server.models.Entity.findOne({ type: 'pool' }, { _id: 1, type: 1, poolId: 1 }).exec())?.toObject()

      const source = await server.models.Source.findOne({ type: 'ipfs', entity: poolEntityId }, { _id: 1, type: 1 }).exec()
      if (!source) {
        server.log.warn({ poolEntityId }, 'No ipfs source found for pool entity!')
        return undefined
      }
      const frame = await server.models.Frame.findOne({ source: source._id }, { data: 1, poolId: 1 }, { sort: { createdAt: -1 } }).exec()
      if (!frame?.data) {
        server.log.warn({ poolEntityId, source, frame }, 'No frame found for ipfs source of pool entity!')
        return undefined
      }

      // read predefined aggregations (aggregates) from pool metadata and filter out invalid pipelines
      const { aggregates: rawAggregates = {} } = frame.data as { aggregates?: Record<string, PipelineStage[]> }
      const aggregates = Object.fromEntries(
        Object.entries(rawAggregates).filter(([name, pipeline]) => {
          const { isValid, message } = validatePipeline(pipeline)
          if (!isValid) server.log.warn(`Aggregation pipeline ${name} ignored as: ${message}`)
          return isValid
        })
      )
      const aggregationNames = Object.keys(aggregates)

      if (!aggregationNames.length) {
        server.log.warn(`Pool ${frame.poolId}: No aggregations defined!`)
        return undefined
      }

      // build graphql types for aggregations
      const aggregationsSchemaTypes = /* GraphQL */ `
            directive @skipAuth on FIELD_DEFINITION
            scalar JSON

            type Aggregations {
             ${aggregationNames
               .map(
                 (name) => `
             """
             Get ${name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()}.
             """
             ${name}: [JSON!] @skipAuth
             `
               )
               .join('\n')} 
            }

            type Query {
              """
              Get predefined pool aggregations.
              """
              aggregations: Aggregations! @skipAuth
            }
            `
      const schema = buildSchema(aggregationsSchemaTypes)

      // build graphql resolvers for aggregations
      const resolvers = {
        JSON: JSONResolver,
        Query: {
          aggregations: async () => {
            return {}
          },
        },
        Aggregations: Object.fromEntries(
          aggregationNames.map((name): [string, GraphQL.Resolver<unknown, unknown, GraphQL.ServerContext>] => {
            return [
              name,
              async (_, __, { server }) => {
                const pipeline = [...loansWithLatestFramePerSource.pipeline]
                if (aggregates[name]) pipeline.push(...(aggregates[name] as PipelineStage[]))
                const aggregation = await server.models[loansWithLatestFramePerSource.model].aggregate(pipeline).exec()
                return aggregation.map((item) => {
                  const mapped: Record<string, string> = {}
                  Object.entries(item).forEach(([key, value], index) => {
                    mapped[`key${index}`] = key
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    mapped[`value${index}`] = (value as any)?.toString()
                  })
                  return mapped
                })
              },
            ]
          })
        ),
      }

      server.log.info(`Pool ${frame.poolId}: Aggregations schema built.`)

      // return schema with resolvers
      return addResolversToSchema({ schema, resolvers })
    }

    const loadSubquerySchema = async (): Promise<GraphQLSchema | SubschemaConfig | undefined> => {
      const load = async function (): ReturnType<typeof loadSubquerySchema> {
        server.log.debug('Loading SubQuery schema...')

        if (!SUBQL_ENDPOINT) {
          server.log.warn('Not integrating SubQuery schema because SUBQL_ENDPOINT is undefined.')
          return undefined
        }
        const executor = buildHTTPExecutor({
          endpoint: SUBQL_ENDPOINT,
        })
        const schema = await schemaFromExecutor(executor)
        const transforms: Transform[] = [new SubqueryTransform(server.log)]
        server.log.debug('SubQuery schema loaded')
        return { schema, executor, transforms }
      }

      return new Promise<Awaited<ReturnType<typeof load>>>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Timeout exeeded for loading SubQuery schema (SUBQL_TIMEOUT=${SUBQL_TIMEOUT}ms)`))
        }, Number(SUBQL_TIMEOUT))
        load()
          .then((schema) => {
            clearTimeout(timeout)
            resolve(schema)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }

    const subquerySchema = await loadSubquerySchema()

    const loadPoolSchema = async function (poolEntityId: Types.ObjectId): Promise<GraphQLSchema> {
      const subschemas: (GraphQLSchema | SubschemaConfig)[] = [staticSchema]

      // load dynamic pool specific schemas
      const aggregationsSchema = await loadAggregationsSchema(poolEntityId)
      if (aggregationsSchema) subschemas.push(aggregationsSchema)

      // add subquery schema if given
      if (subquerySchema) subschemas.push(subquerySchema)

      // combine schemas into one
      return stitchSchemas({
        subschemas,
      })
    }

    const poolEntities = await server.models.Entity.find({ type: 'pool' }, { _id: 1, type: 1, poolId: 1 }).exec()

    const poolSchemas = await Promise.all(poolEntities.map(({ _id }) => loadPoolSchema(_id)))

    const schemas: Schema['schemas'] = Object.fromEntries(
      poolEntities.map(({ poolId }, index) => {
        const schema = poolSchemas[index]
        if (!schema) throw new ApiError(500, { poolId, index }, `Schema missing for pool ${poolId}!`)
        return [poolId, schema]
      })
    )

    server.decorate<Schema>('schema', {
      schemas,
      select: function (context) {
        if (!context) throw new ApiError(500, undefined, 'Context is missing. Can not select schema.')
        const {
          server,
          serverRequest: { params },
        } = context as GraphQL.ServerContext
        const { id: poolId } = params as { id?: string }

        if (!poolId) throw new GraphQLError('pool id is undefined. Can not select schema.')

        const schema = server.schema.schemas[poolId]

        if (!schema) throw new GraphQLError(`The pool id ${poolId} does not exist or is not indexed!`)

        return schema
      },
    })

    server.log.debug('Schema plugin registerd')
  },
  {
    name: 'schema',
    decorators: {
      fastify: ['models'],
    },
    dependencies: ['models'],
  }
)

export default plugin
