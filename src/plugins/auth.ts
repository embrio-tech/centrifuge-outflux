import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import fauth from '@fastify/auth'
import { PolkaJsVerifier, JW3TVerifier } from 'jw3t'
import { API_KEY } from '../config'
import { ApiError } from '../helpers'
import type { AuthCollect, AuthIdentity, AuthResolveGraphQLUser, AuthVerify } from '../@types/auth'

const plugin: FastifyPluginCallback = fp(async function (server) {
  if (!API_KEY) throw new Error('There is no API_KEY specified on the environment!')
  const polkaJsVerifier = new PolkaJsVerifier()
  const verifier = new JW3TVerifier(polkaJsVerifier)

  server.decorateRequest<AuthIdentity | null>('identity', null)
  server.addHook('onRequest', async (request) => {
    // initialize a new identity object for every request to achieve proper encapsulation across requests
    request.identity = {}
  })

  server.decorate<AuthCollect>('collect', {
    // collect factory
    multiple: (collectors) => {
      return async function (request, reply) {
        // run auth context collectors
        await Promise.all(
          collectors.map((collector) => {
            return collector(request, reply)
          })
        )
      }
    },
    // collectors:
    apiKey: async (request) => {
      const { authorization } = request.headers

      if (authorization && !authorization.includes('Bearer')) {
        if (request.identity) {
          request.identity.apiKey = authorization
          request.identity.provider = 'apiKey'
          server.log.debug({ identityProvider: request.identity.provider }, 'collected api key')
        }
      }
    },
    jw3t: async (request) => {
      const { authorization } = request.headers

      if (authorization) {
        const [authType, token] = authorization.trim().split(' ')
        if (authType === 'Bearer' && token) {
          try {
            const { payload } = await verifier.verify(token)
            if (request.identity) {
              request.identity.jw3tPayload = payload
              request.identity.provider = 'jw3t'
              server.log.debug({ identityProvider: request.identity.provider }, 'collected jw3t')
            }
          } catch (error) {
            server.log.debug(error, (error as Error).message)
          }
        }
      }
    },
  })

  server.decorate<AuthVerify>('verify', {
    apiKey: async (request: FastifyRequest) => {
      const { apiKey, provider } = request.identity || {}
      if (provider === 'apiKey') {
        server.log.debug({ provider }, 'verify api key')
        if (!apiKey || apiKey !== API_KEY) throw new ApiError(401, undefined, 'Please provide a valid API key!')
      } else {
        throw new ApiError(401, { provider }, 'Not the right authentication provider!')
      }
    },
    jw3t: async (request: FastifyRequest) => {
      const { jw3tPayload, provider } = request.identity || {}
      if (provider === 'jw3t') {
        server.log.debug({ jw3tPayload, provider }, 'verify jw3t payload')
        // TODO: verify content of payload?
        if (!jw3tPayload) throw new ApiError(401, undefined, 'jw3t payload is missing!')
      } else {
        throw new ApiError(401, { provider }, 'Not the right authentication provider!')
      }
    },
  })

  server.decorate<AuthResolveGraphQLUser>('resolveGraphQLUser', async function (context) {
    const { serverRequest, server } = context
    try {
      await Promise.any([server.verify.apiKey(serverRequest), server.verify.jw3t(serverRequest)])
      server.log.debug({ identityProvider: serverRequest.identity?.provider }, 'graphql user authenticated')
      return serverRequest.identity
    } catch (error) {
      server.log.debug(error, 'graphql user not authenticated')
      return null
    }
  })

  await server.register(fauth)
})

export default plugin
