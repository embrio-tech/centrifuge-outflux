import dotenv from 'dotenv'
dotenv.config()

// export env variables or defaults
export const {
  NODE_ENV = 'development',
  PORT = '5000',
  OPS_ENV = 'local',
  npm_package_version = '0.0.0',
  // DB_URI = 'mongodb://root:mysecret@localhost:27017/blender?authSource=admin',
  // GCP_SVC_ACC_KEY_BASE64 = undefined,
} = process.env
