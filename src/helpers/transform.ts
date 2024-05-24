/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Transform, SchemaTransform, RequestTransform, ResultTransform } from '@graphql-tools/delegate'
import { filterSchema, pruneSchema, mapSchema, MapperKind } from '@graphql-tools/utils'
import { mergeSchemas } from '@graphql-tools/schema'
import type { FastifyBaseLogger } from 'fastify'
import { Kind, type ConstDirectiveNode } from 'graphql'

export class SubqueryTransform<T = any, TContext = Record<string, any>> implements Transform<T, TContext> {
  log: FastifyBaseLogger
  constructor(log: FastifyBaseLogger) {
    this.log = log
  }

  transformSchema: SchemaTransform<TContext> = function (this: InstanceType<typeof SubqueryTransform>, originalWrappingSchema) {
    this.log.debug('Transforming SubQuery schema')

    const skipAuthTypeDef = /* GraphQL */ 'directive @skipAuth on FIELD_DEFINITION'

    // Remove query field from root query object
    const stripedQuerySchema = pruneSchema(
      filterSchema({
        schema: originalWrappingSchema,
        rootFieldFilter: (_operationName, fieldName) => fieldName !== 'query',
      })
    )

    // add @skipAuth directive to each field to not require authentication for subquery fields
    return mapSchema(
      mergeSchemas({
        schemas: [stripedQuerySchema],
        typeDefs: [skipAuthTypeDef],
      }),
      {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const skipAuthDirective: ConstDirectiveNode = {
            kind: Kind.DIRECTIVE,
            name: {
              kind: Kind.NAME,
              value: 'skipAuth',
            },
          }
          const directives = fieldConfig.astNode?.directives ? [...fieldConfig.astNode.directives, skipAuthDirective] : [skipAuthDirective]
          return { ...fieldConfig, astNode: { ...fieldConfig.astNode, directives } as (typeof fieldConfig)['astNode'] }
        },
      }
    )
  }
  transformRequest?: RequestTransform<T, TContext>
  transformResult?: ResultTransform<T, TContext>
}
