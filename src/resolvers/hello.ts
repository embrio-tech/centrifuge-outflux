import type { IFieldResolver } from '@graphql-tools/utils'
import type { FastifyReply, FastifyRequest } from 'fastify'

type IHelloFieldResolver = IFieldResolver<
{ name: string },
{
  request: FastifyRequest
  reply: FastifyReply
}
>

export const short: IHelloFieldResolver = async (source) => {
  const { name } = source
  return `hi ${name}`
}
export const long: IHelloFieldResolver = async (source) => {
  const { name } = source
  return `hello ${name}!`
}
