import { server, errorHandler, ApiPayload } from './helpers'
import { PORT } from './config'
import routes from './routes'

const main = async () => {
  server.addHook<ApiPayload>('preSerialization', async function (request, reply, payload) {
    reply.status(payload.statusCode)
    this.log.debug({ payload, type: typeof payload }, 'preSerialzation payload')
    return payload
  })

  await server.register(routes)
  await server.after()
  await server.ready()
  await server.listen({ port: Number(PORT) })
}

main().catch((error) => {
  errorHandler(error)
  process.exit(1)
})
