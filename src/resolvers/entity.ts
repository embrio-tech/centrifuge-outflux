import type { GraphQL } from '../@types'
import { prepareDBQuery } from '../helpers'

const resolvers: GraphQL.EntityResolvers<GraphQL.ServerContext> = {
  sources: async ({ _id: entityId }, { query }, { server }) => {
    const { filter, skip, limit, sort } = prepareDBQuery(query ?? {})
    const sources = await server.models.Source.find({ ...filter, entity: entityId }, undefined, { skip, limit, sort }).exec()
    return sources.map((source) => source.toObject())
  },
}

export default resolvers
