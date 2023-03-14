import type { GraphQL } from '../@types'
import Query from './query'
import Loan from './loan'
import Source from './source'
import DataFrame from './dataFrame'
import { JSONResolver, DateTimeResolver, ObjectIDResolver } from 'graphql-scalars'

const resolvers: GraphQL.Resolvers<GraphQL.ServerContext> = {
  JSON: JSONResolver,
  DateTime: DateTimeResolver,
  ObjectID: ObjectIDResolver,
  Query,
  Loan,
  Source,
  DataFrame,
}

export default resolvers
