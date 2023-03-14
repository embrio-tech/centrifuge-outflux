import type { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

export interface ILoan {
  sources: ISource[]
}

export interface ISource {
  source: string
  objectId: string
  lastFetchedAt?: Date
}

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Loan model attaching...')
    const { Schema, model } = server.mongoose

    const schema = new Schema<ILoan>(
      {
        sources: [
          {
            source: { type: String, required: true },
            objectId: { type: String, required: true },
            lastFetchedAt: { type: Date, required: false },
          },
        ],
      },
      {
        optimisticConcurrency: true,
        timestamps: true,
      }
    )

    server.models.Loan = model<ILoan>('Loan', schema)

    server.log.debug('Loan model attached')
  },
  {
    name: 'loan',
    decorators: {
      fastify: ['mongoose', 'models'],
    },
    dependencies: ['mongoose'],
  }
)

export default plugin
