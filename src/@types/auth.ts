import type { FastifyRequest } from 'fastify'
import type { JW3TVerifier } from 'jw3t'

export interface AuthVerify {
  apiKey: (request: FastifyRequest) => Promise<void>
  jw3t: (request: FastifyRequest) => Promise<void>
}

export interface AuthIdentity {
  jw3tPayload?: Awaited<ReturnType<JW3TVerifier['verify']>>['payload']
}
