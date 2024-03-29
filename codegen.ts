import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/schemas/**/*.graphql',
  generates: {
    './src/@types/graphql/generated.d.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: {
          JSON: 'any',
          DateTime: 'string',
          ObjectID: 'string',
        },
      },
    },
  },
}
export default config
