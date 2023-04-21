import type { Decimal128 } from 'mongoose'
import type { GraphQL } from '../@types'
import { sumOfNormalizedDebtPerState, ficoWeightedByNormalizedDebt } from '../aggregations'

const resolvers: GraphQL.AggregationsResolvers<GraphQL.ServerContext> = {
  ficoWeightedByNormalizedDebt: async (_, __, { server }) => {
    const aggregation = await server.models[ficoWeightedByNormalizedDebt.model]
      .aggregate<{
        key1: string
        value1: Decimal128
      }>(ficoWeightedByNormalizedDebt.pipeline)
      .exec()
    server.log.debug(aggregation[0], 'ficoWeightedByNormalizedDebt')
    return aggregation.map(({ key1, value1 }) => ({
      value1: value1.toString(),
      key1,
    }))
  },
  sumOfNormalizedDebtPerState: async (_, __, { server }) => {
    const aggregation = await server.models[sumOfNormalizedDebtPerState.model]
      .aggregate<{
        usState: string
        normalizedDebt: Decimal128
      }>(sumOfNormalizedDebtPerState.pipeline)
      .exec()
    server.log.debug(aggregation[0], 'sumOfNormalizedDebtPerState')
    return aggregation.map(({ usState, normalizedDebt }) => {
      server.log.debug({ normalizedDebt, type: typeof normalizedDebt }, 'normalizedDebt')
      return {
        value1: usState,
        key1: 'usState',
        value2: normalizedDebt.toString(),
        key2: 'normalizedDebt',
      }
    })
  },
}

export default resolvers
