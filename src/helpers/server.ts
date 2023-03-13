import Fastify from 'fastify'
import { LOGGER_LEVEL } from '../config'
import { addServerHooks } from '../hooks'
import { registerServerPlugins } from '../plugins'
import routes from '../routes'
import { errorHandler } from './error'

/**
 * server factory function to register all plugins
 *
 * @returns FastifyInstance
 */
export async function buildServer() {
  // initiate server instance
  const server = Fastify({
    logger: { level: LOGGER_LEVEL || 'info' },
  })

  // set custom error handler
  server.setErrorHandler(errorHandler)

  // register plugins
  await registerServerPlugins(server)

  // add hooks
  await addServerHooks(server)

  // register api routes
  await server.register(routes)

  await server.after()
  await server.ready()

  return server
}
