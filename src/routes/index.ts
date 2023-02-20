import graphql from './graphql'
import root from './root'
import type { FastifyPluginCallback } from 'fastify'

const routes: FastifyPluginCallback = async function (server, _options, done) {
  await server.register(graphql, { prefix: '/graphql' })
  await server.register(root)
  done()
}

export default routes
