import { server } from './server'

export const errorHandler = (error: unknown) => {
  server.log.error(error)
}
