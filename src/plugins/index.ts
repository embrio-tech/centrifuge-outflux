import type { FastifyInstance } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import traps from '@dnlup/fastify-traps'
import { CORS_REGEX, NODE_ENV } from '../config'
import mongoose from './mongoose'
import models from './models'
import auth from './auth'
import schema from './schema'

export async function registerServerPlugins(server: FastifyInstance) {
  // add kill handlers
  await server.register(traps)

  // connect to MongoDB
  await server.register(mongoose)

  // attach models
  await server.register(models)

  if (NODE_ENV === 'production') {
    // Security and allow unpkg
    await server.register(helmet, {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          'script-src': ['unpgk.com', 'unsafe-inline'],
          'style-src': ['unpkg.com'],
          'img-src': ['raw.githubusercontent.com'],
        },
      },
    })
  }
  // cors
  await server.register(cors, { origin: CORS_REGEX !== undefined ? new RegExp(CORS_REGEX) : '*' })

  // graphQL schema builder plugin
  await server.register(schema)

  // auth
  await server.register(auth)

  return server
}
