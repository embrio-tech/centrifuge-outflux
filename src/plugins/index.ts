import type { FastifyInstance } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import traps from '@dnlup/fastify-traps'
import { CORS_REGEX, NODE_ENV } from '../config'
import mongoose from './mongoose'

export async function registerServerPlugins(server: FastifyInstance) {
  // add kill handlers
  await server.register(traps)

  // connect to MongoDB
  await server.register(mongoose)

  if (NODE_ENV === 'production') {
    // Security
    await server.register(helmet, {})
  }
  // cors
  await server.register(cors, { origin: CORS_REGEX !== undefined ? new RegExp(CORS_REGEX) : '*' })

  return server
}
