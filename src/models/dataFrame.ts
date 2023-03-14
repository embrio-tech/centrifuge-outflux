import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { Types } from 'mongoose'

export interface IDataFrame {
  source: string
  data: unknown
  loan: Types.ObjectId
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('DataFrame model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<IDataFrame>(
      {
        loan: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
        source: { type: String },
        data: { type: Schema.Types.Mixed },
      },
      {
        optimisticConcurrency: true,
        timestamps: true,
      }
    )

    server.models.DataFrame = model<IDataFrame>('DataFrame', schema)

    server.log.debug('DataFrame model attached')
  },
  {
    name: 'data-frame',
    decorators: {
      fastify: ['mongoose', 'models'],
    },
    dependencies: ['mongoose'],
  }
)

export default plugin
