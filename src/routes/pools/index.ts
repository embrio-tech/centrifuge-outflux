import type { FastifyPluginCallback } from 'fastify'
import pool from './:id'

const routes: FastifyPluginCallback = async function (server) {
  await server.register(pool, { prefix: '/:id' })
}

export default routes
