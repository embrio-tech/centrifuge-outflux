import type { PipelineStage } from 'mongoose'
import type { GraphQL } from './graphql'

export interface Aggregation {
  model: GraphQL.Model
  pipeline: PipelineStage[]
}
