// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type fastify from 'fastify'
import type { Model } from 'mongoose'
import type { IDataFrame, ILoan } from '../models/dataFrame'

declare module 'fastify' {
  export interface FastifyInstance {
    mongoose: typeof import('mongoose')
    models: {
      Loan: Model<ILoan>
      DataFrame: Model<IDataFrame>
    }
    verifyApiKey: () => Promise<void>
  }
}
