import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { Types } from 'mongoose'
import type { DataTypes } from '../@types/models'

export interface IFrame {
  source: Types.ObjectId
  data: unknown
  type?: string

  /**
   * the pool the entity belongs to
   *
   * @type {string}
   * @memberof IFrame
   */
  poolId: string

  /**
   * The data type of the frame
   *
   * @type {DataTypes}
   * @memberof IFrame
   */
  dataType: DataTypes
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Frame model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<IFrame>(
      {
        source: { type: Schema.Types.ObjectId, ref: 'Source', required: true },
        data: { type: Schema.Types.Mixed },
        poolId: { type: 'String', required: true },
        dataType: { type: 'String', required: true },
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
