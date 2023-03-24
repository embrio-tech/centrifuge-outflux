import type { GraphQL } from '../@types'
import { SourceType } from '../models'

const resolvers: GraphQL.LoanResolvers<GraphQL.ServerContext> = {
  pod: async (loan, __, { server }) => {
    const { entity } = loan
    if (!entity) return null
    const source = await server.models.Source.findOne({ entity: entity._id, type: SourceType.Pod }).exec()
    if (!source) return null
    const frame = await server.models.Frame.findOne({ source: source._id }, undefined, { sort: { createdAt: -1 } }).exec()
    if (!frame) return null
    return frame.toObject()
  },
}

export default resolvers
