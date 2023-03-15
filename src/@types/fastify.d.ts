// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type fastify, { FastifyRequest } from 'fastify'
import type { Model } from 'mongoose'
import type { IDataFrame, ILoan } from '../models/dataFrame'

declare module 'fastify' {
  export interface FastifyInstance {
    mongoose: typeof import('mongoose')
    models: {
      Loan: Model<ILoan>
      DataFrame: Model<IDataFrame>
    }
    verifyApiKey: (request: FastifyRequest) => Promise<void>
  }
}
