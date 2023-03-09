// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type fastify from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    mongoose: typeof import('mongoose')
  }
}
