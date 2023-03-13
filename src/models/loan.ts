import type { FastifyPluginCallback } from 'fastify'
import type { GraphQL } from '../@types'
import fp from 'fastify-plugin'

// TODO: separate mongoose model interface from graphql interface. Dont use GraphQL.Loan

const plugin: FastifyPluginCallback = fp(
  async function (server) {
    server.log.debug('Loan model attaching...')

    const loanSchema = new server.mongoose.Schema<GraphQL.Loan>(
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
      }
    )

    server.models.Loan = server.mongoose.model<GraphQL.Loan>('Loan', loanSchema)

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
