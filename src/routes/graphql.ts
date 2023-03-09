import { createYoga } from 'graphql-yoga'
import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify'
import { addResolversToSchema } from '@graphql-tools/schema'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'
import resolvers from '../resolvers'

const routes: FastifyPluginCallback = async function (server, _options, done) {
  server.log.debug({ path: join(__dirname, '../schemas/**/*.graphql') }, 'Load GraphQL schemas from')
  const schema = await loadSchema(join(__dirname, '../schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] })

  server.log.debug(resolvers, 'Load GraphQL resolvers')
  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

  const graphqlServer = createYoga<{
    request: FastifyRequest
    reply: FastifyReply
  }>({
    // Integrate Fastify logger
    logging: {
      debug: (...args) => args.forEach((arg) => server.log.debug(arg)),
      info: (...args) => args.forEach((arg) => server.log.info(arg)),
      warn: (...args) => args.forEach((arg) => server.log.warn(arg)),
      error: (...args) => args.forEach((arg) => server.log.error(arg)),
    },
    schema: schemaWithResolvers,
  })

  // This will allow Fastify to forward multipart requests to GraphQL Yoga
  server.addContentTypeParser('multipart/form-data', {}, (req, payload, done) => done(null))

  server.route({
    url: '/',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (request, reply) => {
      const response = await graphqlServer.handleNodeRequest(request, {
        request,
        reply,
      })
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      reply.status(response.status)

      reply.send(response.body)

      return reply
    },
  })

  done()
}

export default routes
