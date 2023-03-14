import type { GraphQL } from '../@types'

const resolvers: GraphQL.SourceResolvers<GraphQL.ServerContext> = {
  dataFrame: async ({ source }, _, { server }) => {
    const document = await server.models.DataFrame.findOne({ source }, null, { sort: { createdAt: -1 } }).exec()
    if (!document) return null
    const dataFrame: GraphQL.DataFrame = document.toObject()
    return dataFrame
  },
}

export default resolvers
