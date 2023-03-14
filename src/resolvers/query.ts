import type { GraphQL } from '../@types'

const resolvers: GraphQL.QueryResolvers<GraphQL.ServerContext> = {
  loans: async (_, __, { server }) => {
    return server.models.Loan.find().exec()
  },
}

export default resolvers
