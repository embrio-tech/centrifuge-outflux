// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type fastify from 'fastify'
import type { Model } from 'mongoose'
import type { IEntity, IFrame, ISource } from '../models'
import type { GraphQLSchema } from 'graphql'

declare module 'fastify' {
  export interface FastifyInstance {
    mongoose: typeof import('mongoose')
    models: {
      Entity: Model<IEntity>
      Frame: Model<IFrame>
      Source: Model<ISource>
    }
    verifyApiKey: (request: FastifyRequest) => Promise<void>
    verifyJw3t: (request: FastifyRequest) => Promise<void>

    loadSchema: () => Promise<GraphQLSchema>
  }

  export interface FastifyRequest {
    jw3tPayload: unknown
  }
}
