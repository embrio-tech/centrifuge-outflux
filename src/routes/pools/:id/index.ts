import type { FastifyPluginCallback } from 'fastify'
import graphql from './graphql'

const routes: FastifyPluginCallback = async function (server) {
  // pool graphql plugin
  await server.register(graphql, { prefix: '/graphql' })

  // ... more /:id routes here
}

export default routes
