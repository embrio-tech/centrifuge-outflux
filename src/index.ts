import { PORT } from './config'
import { buildServer } from './helpers'
import Pino from 'pino'

const main = async () => {
  const server = await buildServer()
  return server.listen({ port: Number(PORT) })
}

main().catch((error) => {
  Pino().error(error)
  process.exit(1)
})
