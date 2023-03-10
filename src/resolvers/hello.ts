import type { GraphQL } from '../@types'

const resolvers: GraphQL.HelloResolvers<GraphQL.ServerContext> = {
  long: async (source) => {
    const { name } = source
    return `hello ${name}!`
  },
  short: async (source) => {
    const { name } = source
    return `hi ${name}`
  },
}

export default resolvers
