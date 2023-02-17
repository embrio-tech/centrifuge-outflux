import type { FastifyServerOptions } from 'fastify'
import { NODE_ENV } from '../config'

const envToLogger: Record<string, FastifyServerOptions['logger']> = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
    },
  },
  production: true,
}

export const logger = envToLogger[NODE_ENV] || true
