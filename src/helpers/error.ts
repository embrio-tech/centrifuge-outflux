import { STATUS_CODES } from 'http'
import { server } from './server'

export const errorHandler = (error: unknown) => {
  server.log.error(error)
}

export class ApiError extends Error {
  statusCode: number
  status: string
  context?: unknown

  constructor(statusCode: number, context?: unknown, ...params: ConstructorParameters<typeof Error>) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.status = STATUS_CODES[statusCode] || 'Unspecified Status Code'
    if (!this.message) this.message = this.status
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.context = context
  }
}

server.setErrorHandler(function (error, request, reply) {
  const { message, name, stack } = error
  if (error instanceof ApiError) {
    this.log.debug(undefined, 'ApiError Handler')
    const { statusCode, status, context } = error

    // logging
    if (error.statusCode >= 500) {
      this.log.error({ err: error, reqId: request.id }, message)
    } else if (error.statusCode >= 400) {
      this.log.info({ err: error, reqId: request.id }, message)
    } else {
      throw Error('ApiError status code does not represent an error!', { cause: error })
    }

    reply.status(error.statusCode).send({
      statusCode,
      error: status,
      message,
      context,
    })
  } else {
    this.log.debug(undefined, 'Default Error Handler')
    this.log.error(error)
    reply.status(500).send({ statusCode: 500, error: STATUS_CODES[500], message, name, stack })
  }
})
