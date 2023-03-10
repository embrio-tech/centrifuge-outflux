import type { GraphQL } from '../@types'

const resolvers: GraphQL.LoanResolvers = {
  sources: async ({ sources }, _, { server }) => {
    server.log.debug('use sources resovler')
    return sources
  },
  _id: async ({ _id }, _, { server }) => {
    server.log.debug('use _id resolver')
    return _id
  },
}

export default resolvers
