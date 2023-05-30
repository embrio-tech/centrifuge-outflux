import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import models from '../models'

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    await Promise.all(Object.values(models).map((model) => server.register(model)))
  },
  {
    name: 'models',
  }
)

export default plugin
