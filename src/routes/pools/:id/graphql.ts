import { createYoga } from 'graphql-yoga'
import { useSchemaByContext } from '@envelop/core'
import type { FastifyPluginCallback } from 'fastify'
import { OPS_ENV } from '../../../config'
import type { GraphQL } from '../../../@types'

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
  const graphqlServer = createYoga<GraphQL.ServerContext>({
    // Integrate Fastify logger
    logging: {
      debug: (...args) => args.forEach((arg) => server.log.debug(arg)),
      info: (...args) => args.forEach((arg) => server.log.info(arg)),
      warn: (...args) => args.forEach((arg) => server.log.warn(arg)),
      error: (...args) => args.forEach((arg) => server.log.error(arg)),
    },
    plugins: [useSchemaByContext(server.schema.select)],
    graphqlEndpoint: '/pools/:id/graphql',
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

  server.route<{ Params: { id: string } }>({
    url: '/',
    method: ['GET', 'OPTIONS', 'POST'],
    preHandler:
      OPS_ENV === 'production'
        ? server.auth([server.verify.apiKey, server.verify.jw3t], { relation: 'or' })
        : async () => {
            return
          },
    handler: async (request, reply) => {
      const {
        params: { id },
      } = request
      const response = await graphqlServer.handleNodeRequest(request, {
        request,
        reply,
        server,
        poolId: id,
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
