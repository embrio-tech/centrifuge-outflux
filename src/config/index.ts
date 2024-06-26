import dotenv from 'dotenv'
dotenv.config()

// export env variables or defaults
export const {
  NODE_ENV = 'development',
  PORT = '5000',
  OPS_ENV = 'local',
  npm_package_version = '0.0.0',
  DB_URI = 'mongodb://mongodb:mongodb@localhost:27017/blender?authSource=admin',
  API_KEY, // static API key for protecting graphql endpoints
  LOGGER_LEVEL, // One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'
  CORS_REGEX, // = '^https:\\/\\/((([0-9a-zA-Z-]*)\\.)+(?!a-zA-Z0-9-))?embrio\\.tech$',
  // DB_URI = 'mongodb://root:mysecret@localhost:27017/blender?authSource=admin',
  // GCP_SVC_ACC_KEY_BASE64 = undefined,
  CHAIN_NODE = 'wss://fullnode.development.cntrfg.com',
  SUBQL_ENDPOINT, // = 'https://api.subquery.network/sq/centrifuge/pools-demo-multichain',
  SUBQL_TIMEOUT = 30000, // the time to wait for loading the remote subql graph
} = process.env
