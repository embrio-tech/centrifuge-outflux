import Fastify from 'fastify'
import { logger } from './logger'

export const server = Fastify({
  logger,
})
