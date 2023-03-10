import type { GraphQL } from '../@types'

import Hello from './hello'
import Loan from './loan'

const resolvers: GraphQL.Resolvers<GraphQL.ServerContext> = {
  Query: {
    hello: async () => ({ name: 'world' }),
    loans: async () => [
      {
        _id: 'jasdkfkhadf',
        sources: [
          { _id: 'mkiijn', source: 'ipfs', objectId: '45678', lastFetchedAt: new Date('2023-03-07').toISOString() },
          { _id: 'nuzhbs', source: 'chain', objectId: '12345', lastFetchedAt: new Date('2023-03-08').toISOString() },
        ],
      },
      {
        _id: 'iquroqewruo',
        sources: [
          { _id: 'vgthbh', source: 'ipfs', objectId: 'asdfg', lastFetchedAt: new Date('2023-03-06').toISOString() },
          { _id: 'ysedcd', source: 'chain', objectId: 'ghjkl', lastFetchedAt: new Date('2023-03-05').toISOString() },
        ],
      },
    ],
  },

  Hello,
  Loan,
}

export default resolvers
