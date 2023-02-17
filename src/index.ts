import { server, errorHandler } from './helpers'
import { PORT } from './config'

server.get('/', async (request) => {
  server.log.debug(request.query, 'request query')
  return { hello: 'world' }
})

const main = async () => {
  await server.listen({ port: Number(PORT) })
}

main().catch((error) => {
  errorHandler(error)
  process.exit(1)
})
