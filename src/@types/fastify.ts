// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type fastify from 'fastify'
import type { Model } from 'mongoose'
import type { IEntity, IFrame, ISource } from '../models'
import type { AuthCollect, AuthResolveGraphQLUser, AuthIdentity, AuthVerify } from './auth'
import type { Schema } from './schema'

declare module 'fastify' {
  export interface FastifyInstance {
    // data base and models
    mongoose: typeof import('mongoose')
    models: {
      Entity: Model<IEntity>
      Frame: Model<IFrame>
      Source: Model<ISource>
    }

    // authentication
    verify: AuthVerify
    collect: AuthCollect
    resolveGraphQLUser: AuthResolveGraphQLUser

    // graphql schema
    schema: Schema
  }

  export interface FastifyRequest {
    identity: AuthIdentity | null
  }
}
