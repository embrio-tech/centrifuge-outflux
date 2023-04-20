import { createYoga } from 'graphql-yoga'
import type { FastifyPluginCallback } from 'fastify'
import { addResolversToSchema } from '@graphql-tools/schema'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'
import resolvers from '../resolvers'
import { OPS_ENV } from '../config'
import type { GraphQL } from '../@types'

const defaultQuery = /* GraphQL */ `
  query GetEntities {
    # get list of loans
    loans: entities(type: loan) {
      sources {
        type
        frames {
          data
        }
      }
    }
    # get list of loan templates
    loanTemplates: entities(type: loanTemplate) {
      sources {
        type
        frames {
          data
        }
      }
    }
  }
`

const routes: FastifyPluginCallback = async function (server, _options, done) {
  server.log.debug({ path: join(__dirname, '../schemas/**/*.graphql') }, 'Load GraphQL schemas from')
  const schema = await loadSchema(join(__dirname, '../schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] })

  server.log.debug(resolvers, 'Load GraphQL resolvers')
  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

  const graphqlServer = createYoga<GraphQL.ServerContext>({
    // Integrate Fastify logger
    logging: {
      debug: (...args) => args.forEach((arg) => server.log.debug(arg)),
      info: (...args) => args.forEach((arg) => server.log.info(arg)),
      warn: (...args) => args.forEach((arg) => server.log.warn(arg)),
      error: (...args) => args.forEach((arg) => server.log.error(arg)),
    },
    schema: schemaWithResolvers,
    graphiql:
      OPS_ENV === 'production'
        ? false
        : {
            title: 'Centrifuge Outflux',
            defaultQuery,
          },
  })

  // This will allow Fastify to forward multipart requests to GraphQL Yoga
  server.addContentTypeParser('multipart/form-data', {}, (req, payload, done) => done(null))

  server.route({
    url: '/',
    method: ['GET', 'OPTIONS', 'POST'],
    preHandler:
      OPS_ENV === 'production'
        ? server.auth([server.verifyApiKey, server.verifyJw3t], { relation: 'or' })
        : async () => {
            return
          },
    handler: async (request, reply) => {
      const response = await graphqlServer.handleNodeRequest(request, {
        request,
        reply,
        server,
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
