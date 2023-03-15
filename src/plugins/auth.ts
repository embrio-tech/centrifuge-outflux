import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import fauth from '@fastify/auth'
import { API_KEY } from '../config'
import { ApiError } from '../helpers'

const plugin: FastifyPluginCallback = fp(async function (server) {
  if (!API_KEY) throw new Error('There is no API_KEY specified on the environment!')
  server.decorate('verifyApiKey', async (request: FastifyRequest) => {
    const { authorization } = request.headers
    if (!authorization || authorization !== API_KEY) throw new ApiError(401, undefined, 'Please provide a valid API key!')
  })

  await server.register(fauth)
})

export default plugin
