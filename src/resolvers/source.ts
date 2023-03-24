import type { GraphQL } from '../@types'
import { prepareDBQuery } from '../helpers'

const resolvers: GraphQL.SourceResolvers<GraphQL.ServerContext> = {
  frames: async ({ _id: sourceId }, { query }, { server }) => {
    const { filter, skip, limit, sort } = prepareDBQuery(query ?? {})
    const frames = await server.models.Frame.find({ ...filter, source: sourceId }, undefined, { skip, limit, sort }).exec()
    return frames.map((frame) => frame.toObject())
  },
}

export default resolvers
