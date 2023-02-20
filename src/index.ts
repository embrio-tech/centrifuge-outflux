import { server, errorHandler, ApiError } from './helpers'
import { PORT } from './config'
import type { RouteGenericInterface } from 'fastify'

interface RouteInterface extends RouteGenericInterface {
  Querystring: { error: string }
}

server.get<RouteInterface>('/', async (request) => {
  const { query } = request
  if (query.error) throw new ApiError(400, { query }, 'The query param caused an error!')
  return { hello: 'world' }
})

const main = async () => {
  await server.listen({ port: Number(PORT) })
}

main().catch((error) => {
  errorHandler(error)
  process.exit(1)
})
