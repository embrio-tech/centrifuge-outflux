import type { GraphQL } from '../@types'
import { EntityType } from '../models'

const resolvers: GraphQL.QueryResolvers<GraphQL.ServerContext> = {
  loans: async (_, __, { server }) => {
    const entities = await server.models.Entity.find({ type: EntityType.Loan }).exec()
    return entities.map((entity) => ({ entity: entity.toObject() }))
  },
}

export default resolvers
