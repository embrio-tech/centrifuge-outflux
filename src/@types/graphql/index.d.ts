import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import type { IFieldResolver } from '@graphql-tools/utils'
// https://www.typescriptlang.org/docs/handbook/modules.html#import-a-module-for-side-effects-only
import './generated'

declare namespace GraphQL {
  export interface ServerContext {
    request: FastifyRequest
    reply: FastifyReply
    server: FastifyInstance
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FieldResolvers<SourceSchema = any, FieldsSchema = SourceSchema> = {
    [key in keyof FieldsSchema]?: IFieldResolver<SourceSchema, ServerContext>
  }

  export * from './generated'
}
