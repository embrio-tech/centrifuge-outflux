import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import type { Types } from 'mongoose'

export enum SourceType {
  Chain = 'chain',
  Ipfs = 'ipfs',
  Pod = 'pod',
  Subql = 'subql'
}

export interface ISource {
  entity: Types.ObjectId
  type: SourceType
  objectId: string
  lastFetchedAt: Date
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Source model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<ISource>(
      {
        entity: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
        type: { type: 'String', required: true, enum: SourceType },
        objectId: { type: String, required: true },
        lastFetchedAt: { type: Date, required: false },
      },
      {
        optimisticConcurrency: true,
        timestamps: true,
      }
    )

    server.models.Source = model<ISource>('Source', schema)

    server.log.debug('Source model attached')
  },
  {
    name: 'source',
    decorators: {
      fastify: ['mongoose', 'models'],
    },
    dependencies: ['mongoose'],
  }
)

export default plugin
