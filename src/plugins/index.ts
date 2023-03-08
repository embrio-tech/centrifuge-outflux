import type { FastifyInstance } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import traps from '@dnlup/fastify-traps'
import { CORS_REGEX, NODE_ENV } from '../config'

export async function registerServerPlugins(server: FastifyInstance) {
  server.register(traps)

  if (NODE_ENV === 'production') {
    // Security
    server.register(helmet, {})
  }
  // cors
  server.register(cors, { origin: CORS_REGEX !== undefined ? new RegExp(CORS_REGEX) : '*' })

  return server
}
