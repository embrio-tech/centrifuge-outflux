import type { FastifyPluginCallback } from 'fastify'
import { connect } from 'mongoose'
import { DB_URI } from '../config'

const plugin: FastifyPluginCallback = async function (server) {
  server.log.debug('MongoDB connection initializing...')
  const mongoose = await connect(DB_URI, { connectTimeoutMS: 5000 })

  const {
    host,
    port,
    db: { namespace },
  } = mongoose.connection
  server.log.info('MongoDB connection initialized')
  server.log.debug({ host, port, namespace }, 'MongoDB connection')

  // add mongose instance to server instance
  server.decorate('mongoose', mongoose)

  // disconnect on application close
  server.addHook('onClose', async function (server) {
    await mongoose.connection.close()
    server.log.info('MongoDB connection closed')
  })
}

export default plugin