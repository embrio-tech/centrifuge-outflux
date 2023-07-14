import type { GraphQL } from '../@types'
import { prepareDBQuery } from '../helpers'
import { validatePipeline } from '../helpers/validators'
import { EntityType } from '../models'
import type { PipelineStage } from 'mongoose'

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
  aggregate: async (_, { pipeline, model }: { pipeline: PipelineStage[]; model: GraphQL.Model }, { server }) => {
    const { isValid, message } = validatePipeline(pipeline)
    if (!isValid) throw new Error(message)
    return server.models[model].aggregate(pipeline).exec()
  },
}

export default resolvers
