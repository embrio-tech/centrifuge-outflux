import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { GraphQLSchema } from 'graphql'
import { join } from 'path'
import { addResolversToSchema } from '@graphql-tools/schema'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import resolvers from '../resolvers'

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Schema plugin registering...')

    server.decorate('loadSchema', async function (): Promise<GraphQLSchema> {
      server.log.debug({ path: join(__dirname, '../schemas/schema.graphql') }, 'Load GraphQL schemas from')
      const schema = await loadSchema(join(__dirname, '../schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] })

      server.log.debug(resolvers, 'Load GraphQL resolvers')
      const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

      return schemaWithResolvers
    })

    server.log.debug('Schema plugin registerd')
  },
  { name: 'schema' }
)

export default plugin
