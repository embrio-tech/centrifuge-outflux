import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/schemas/schema.graphql',
  generates: {
    './src/@types/graphql/resolvers.d.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}
export default config
