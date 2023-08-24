import pools from './pools'
import root from './root'
import type { FastifyPluginCallback } from 'fastify'

const routes: FastifyPluginCallback = async function (server, _options, done) {
  await server.register(pools, { prefix: '/pools' })
  await server.register(root)
  done()
}

export default routes
