import type { GraphQL } from '../@types'
import Loan from './loan'

const resolvers: GraphQL.Resolvers<GraphQL.ServerContext> = {
  Query: {
    loans: async (_, __, { server }) => server.models.Loan.find().exec(),
  },

  Loan,
}

export default resolvers
