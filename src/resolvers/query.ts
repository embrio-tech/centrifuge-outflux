import type { GraphQL } from '../@types'
import { prepareDBQuery } from '../helpers'
import { EntityType } from '../models'

const resolvers: GraphQL.QueryResolvers<GraphQL.ServerContext> = {
  loans: async (_, __, { server }) => {
    const entities = await server.models.Entity.find({ type: EntityType.Loan }).exec()
    return entities.map((entity) => ({ entity: entity.toObject() }))
  },
  entities: async (_, { type, query }, { server }) => {
    const { filter, skip, limit, sort } = prepareDBQuery(query ?? {})
    const entities = await server.models.Entity.find({ ...filter, type }, undefined, { skip, limit, sort }).exec()
    return entities.map((entity) => entity.toObject())
  },
}

export default resolvers
