// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type fastify from 'fastify'
import type { Model } from 'mongoose'
import type { IEntity, IFrame, ISource } from '../models'
import type { AuthIdentity, AuthVerify } from './auth'
import type { Schema } from './schema'

declare module 'fastify' {
  export interface FastifyInstance {
    mongoose: typeof import('mongoose')
    models: {
      Entity: Model<IEntity>
      Frame: Model<IFrame>
      Source: Model<ISource>
    }
    verify: AuthVerify

    schema: Schema
  }

  export interface FastifyRequest {
    identity: AuthIdentity | null
  }
}
