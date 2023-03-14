import type { FastifyInstance } from 'fastify'
import status from './status'

export async function addServerHooks(server: FastifyInstance) {
  server.addHook<Api.Payload>('preSerialization', status)
  return server
}
