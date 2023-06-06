import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

export enum EntityType {
  Loan = 'loan',
  LoanTemplate = 'loanTemplate',
  Pool = 'pool',
}

export interface IEntity {
  type: EntityType
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Entity model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<IEntity>(
      {
        type: { type: 'String', required: true, enum: EntityType },
      },
      {
        optimisticConcurrency: true,
        timestamps: true,
      }
    )

    server.models.Entity = model<IEntity>('Entity', schema)

    server.log.debug('Entity model attached')
  },
  {
    name: 'entity',
    decorators: {
      fastify: ['mongoose', 'models'],
    },
    dependencies: ['mongoose'],
  }
)

export default plugin
