import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import fauth from '@fastify/auth'
import { PolkaJsVerifier, JW3TVerifier } from 'jw3t'
import { API_KEY } from '../config'
import { ApiError } from '../helpers'
import type { AuthIdentity, AuthVerify } from '../@types/auth'

const plugin: FastifyPluginCallback = fp(async function (server) {
  if (!API_KEY) throw new Error('There is no API_KEY specified on the environment!')
  const polkaJsVerifier = new PolkaJsVerifier()
  const verifier = new JW3TVerifier(polkaJsVerifier)

  server.decorateRequest<AuthIdentity | null>('identity', null)
  server.addHook('onRequest', async (request) => {
    // initialize a new identity object for every request to achieve proper encapsulation across requests
    request.identity = {}
  })

  server.decorate<AuthVerify>('verify>', {
    apiKey: async (request: FastifyRequest) => {
      const { authorization } = request.headers
      if (!authorization || authorization !== API_KEY) throw new ApiError(401, undefined, 'Please provide a valid API key!')
    },
    jw3t: async (request: FastifyRequest) => {
      const { authorization } = request.headers
      if (!authorization) throw new ApiError(401, 'You must send an Authorization header')
      const [authType, token] = authorization.trim().split(' ')
      if (authType !== 'Bearer') throw new ApiError(401, 'Expected a Bearer token')
      if (!token) throw new ApiError(401, 'Token is missing!')

      const { payload } = await verifier.verify(token)

      if (request.identity) {
        request.identity.jw3tPayload = payload
      }
    },
  })

  await server.register(fauth)
})

export default plugin
