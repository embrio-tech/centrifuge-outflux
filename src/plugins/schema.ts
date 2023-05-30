import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { GraphQLSchema } from 'graphql'
import { buildSchema } from 'graphql'
import { join } from 'path'
import { addResolversToSchema } from '@graphql-tools/schema'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { stitchSchemas } from '@graphql-tools/stitch'
import resolvers from '../resolvers'
import type { PipelineStage } from 'mongoose'
import type { GraphQL } from '../@types'
import { loansWithLatestFramePerSource } from '../aggregations'

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Schema plugin registering...')

    const loadAggregationSchema = async function (): Promise<GraphQLSchema | undefined> {
      const poolEntity = await server.models.Entity.findOne({ type: 'pool' }, { _id: 1, type: 1 }).exec()
      if (!poolEntity) {
        server.log.warn({}, 'No pool entity found!')
        return undefined
      }

      const source = await server.models.Source.findOne({ type: 'ipfs', entity: poolEntity._id }, { _id: 1, type: 1 }).exec()
      if (!source) {
        server.log.warn({ poolEntity }, 'No ipfs source found for pool entity!')
        return undefined
      }

      const frame = await server.models.Frame.findOne({ source: source._id }, { data: 1 }, { sort: { createdAt: -1 } }).exec()
      if (!frame?.data) {
        server.log.warn({ poolEntity, source, frame }, 'No frame found for source of pool entity!')
        return undefined
      }

      const { aggregates = {} } = frame.data as { aggregates?: Record<string, PipelineStage[]> }
      const aggregationNames = Object.keys(aggregates)

      const aggregationSchemaTypes = /* GraphQL */ `
            scalar JSON

            type Aggregations {
             ${aggregationNames.map((name) => `${name}: [JSON!]`).join('\n')} 
            }

            type Query {
              """
              Get predefined pool aggregations
              """
              aggregations: Aggregations!
            }
            `

      const schema = buildSchema(aggregationSchemaTypes)

      const resolvers = {
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
                    mapped[`value${index}`] = (value as any).toString()
                  })
                  return mapped
                })
              },
            ]
          })
        ),
      }

      return addResolversToSchema({ schema, resolvers })
    }

    server.decorate('loadSchema', async function (): Promise<GraphQLSchema> {
      const subschemas: GraphQLSchema[] = []

      // load default static schemas
      server.log.debug({ path: join(__dirname, '../schemas/schema.graphql') }, 'Load GraphQL schemas from')
      const schema = await loadSchema(join(__dirname, '../schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] })

      server.log.debug(resolvers, 'Load GraphQL resolvers')
      const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

      subschemas.push(schemaWithResolvers)

      // load dynamic pool specific schemas
      const aggregationSchema = await loadAggregationSchema()

      if (aggregationSchema) subschemas.push(aggregationSchema)

      return stitchSchemas({
        subschemas,
      })
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
