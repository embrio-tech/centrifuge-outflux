import type { GraphQLSchema } from 'graphql'

export interface Schema {
  schemas: Record<string, GraphQLSchema>
  select: (context?: unknown) => GraphQLSchema
}
