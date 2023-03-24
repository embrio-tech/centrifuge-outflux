import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { Types } from 'mongoose'

export interface IFrame {
  source: Types.ObjectId
  data: unknown
  type?: string
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Frame model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<IFrame>(
      {
        source: { type: Schema.Types.ObjectId, ref: 'Source', required: true },
        data: { type: Schema.Types.Mixed },
      },
      {
        optimisticConcurrency: true,
        timestamps: true,
      }
    )

    server.models.Frame = model<IFrame>('Frame', schema)

    server.log.debug('Frame model attached')
  },
  {
    name: 'frame',
    decorators: {
      fastify: ['mongoose', 'models'],
    },
    dependencies: ['mongoose'],
  }
)

export default plugin
