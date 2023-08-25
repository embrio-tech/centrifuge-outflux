import type { ResolveUserFn } from '@envelop/generic-auth'
import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'
import type { JW3TVerifier } from 'jw3t'
import type { GraphQL } from './graphql'

export type AuthMethod = 'apiKey' | 'jw3t'

export type AuthCollector<RouteGeneric extends RouteGenericInterface = RouteGenericInterface> = (
  request: FastifyRequest<RouteGeneric>,
  reply: FastifyReply
) => Promise<void>

export type AuthCollectors<RouteGeneric extends RouteGenericInterface = RouteGenericInterface> = {
  [collector in AuthMethod]: AuthCollector<RouteGeneric>
}

export type AuthCollectFacotry<RouteGeneric extends RouteGenericInterface = RouteGenericInterface> = (
  collectors: AuthCollector<RouteGeneric>[]
) => (request: FastifyRequest<RouteGeneric>, reply: FastifyReply) => Promise<void>

export type AuthCollect = { multiple: AuthCollectFacotry } & AuthCollectors

export interface AuthVerify {
  apiKey: (request: FastifyRequest) => Promise<void>
  jw3t: (request: FastifyRequest) => Promise<void>
}

export interface AuthIdentity {
  provider?: AuthMethod
  apiKey?: string
  jw3tPayload?: Awaited<ReturnType<JW3TVerifier['verify']>>['payload']
}

export type AuthResolveGraphQLUser = ResolveUserFn<AuthIdentity, GraphQL.ServerContext>
