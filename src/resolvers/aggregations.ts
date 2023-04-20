import type { GraphQL } from '../@types'

const resolvers: GraphQL.AggregationsResolvers<GraphQL.ServerContext> = {
  FICO: async () => {
    return Math.round(Math.random() * 1000) / 1000
  },
  outstandingDebt: async () => {
    return Math.round(Math.random() * 1000) / 1000
  },
}

export default resolvers
