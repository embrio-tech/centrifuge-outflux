import type { FastifyPluginCallback, RouteGenericInterface } from 'fastify'
import { NODE_ENV, npm_package_version, OPS_ENV } from '../config'
import { ApiError, ApiPayload } from '../helpers'

interface RootGetRouteInterface extends RouteGenericInterface {
  Querystring: { error: string; status?: string }
}

interface HealthGetInterface extends RouteGenericInterface {
  Reply: ApiPayload<undefined>
}

const routes: FastifyPluginCallback = async function (server, _options, done) {
  server.get<RootGetRouteInterface>('/', async (request) => {
    const { query } = request
    if (query.error) throw new ApiError(Number(query.status) || 400, { query }, 'The query param caused an error!')
    return new ApiPayload(200, 'Hello world!', { hello: 'world' })
  })

  server.get<HealthGetInterface>('/health', async () => {
    return new ApiPayload(200, `I am good. Thanks for asking. (NODE_ENV=${NODE_ENV}, OPS_ENV=${OPS_ENV}, version=v${npm_package_version})`)
  })

  done()
}

export default routes
