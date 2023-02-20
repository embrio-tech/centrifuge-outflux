// export * from './hello'

import type { IResolvers } from '@graphql-tools/utils'
import type { FastifyReply, FastifyRequest } from 'fastify'
import * as Hello from './hello'

const resolvers: IResolvers<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  {
    request: FastifyRequest
    reply: FastifyReply
  }
> = {
  Query: {
    hello: async () => ({ name: 'world' }),
  },

  Hello,
}

export default resolvers
