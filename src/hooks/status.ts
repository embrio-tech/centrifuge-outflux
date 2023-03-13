import type { preSerializationHookHandler } from 'fastify'

const hook: preSerializationHookHandler<Api.Payload> = async function (request, reply, payload) {
  reply.status(payload.statusCode)
  this.log.debug({ payload: payload, type: typeof payload }, 'preSerialization hook')
  return payload
}

export default hook
