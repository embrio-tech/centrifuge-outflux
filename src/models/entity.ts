import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

/**
 * The type of an entity
 *
 * @enum {string}
 */
export enum EntityType {
  Loan = 'loan',
  LoanTemplate = 'loanTemplate',
  Pool = 'pool',
}

export interface IEntity {
  /**
   * the type of the entity
   *
   * @type {EntityType}
   * @memberof IEntity
   */
  type: EntityType

  /**
   * the pool the entity belongs to
   *
   * @type {string}
   * @memberof IEntity
   */
  poolId: string
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Entity model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<IEntity>(
      {
        type: { type: 'String', required: true, enum: EntityType },
        poolId: { type: 'String', required: true },
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
