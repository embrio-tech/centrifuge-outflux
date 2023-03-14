import type { GraphQL } from '../@types'

const resolvers: GraphQL.SourceResolvers<GraphQL.ServerContext> = {
  dataFrame: async ({ source }, _, { server }) => {
    // TODO: filter by _id of source or loan. At the moment we find just one dataframe which has no connection to loan
    server.log.warn('Query dataframe without connection to loan.')
    const document = await server.models.DataFrame.findOne({ source }, null, { sort: { createdAt: -1 } }).exec()
    if (!document) return null
    const dataFrame: GraphQL.DataFrame = document.toObject()
    return dataFrame
  },
}

export default resolvers
