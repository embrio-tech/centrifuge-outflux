import type { GraphQL } from '../@types'
import Query from './query'
import Loan from './loan'
import Source from './source'
import Frame from './frame'
import Entity from './entity'
import Aggregations from './aggregations'
import { JSONResolver, DateTimeResolver, ObjectIDResolver } from 'graphql-scalars'

const resolvers: GraphQL.Resolvers<GraphQL.ServerContext> = {
  JSON: JSONResolver,
  DateTime: DateTimeResolver,
  ObjectID: ObjectIDResolver,
  Query,
  Loan,
  Entity,
  Source,
  Frame,
  Aggregations,
}

export default resolvers
