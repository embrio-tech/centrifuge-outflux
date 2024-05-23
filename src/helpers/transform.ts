/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Transform, SchemaTransform, RequestTransform, ResultTransform } from '@graphql-tools/delegate'
import { filterSchema, pruneSchema } from '@graphql-tools/utils'

export class SubqueryTransform<T = any, TContext = Record<string, any>> implements Transform<T, TContext> {
  log: any
  constructor(log: any) {
    this.log = log
  }

  transformSchema: SchemaTransform<TContext> = function (this: InstanceType<typeof SubqueryTransform>, originalWrappingSchema) {
    // this.log.debug(originalWrappingSchema, 'originalWrappingSchema')
    // this.log.debug()
    return pruneSchema(
      filterSchema({
        schema: originalWrappingSchema,
        // typeFilter: (_typeName) => true,
        rootFieldFilter: (_operationName, fieldName) => fieldName !== 'query',
        // fieldFilter: (typeName, fieldName) => {
        //   this.log.debug(fieldName)
        //   return true
        // },
        // argumentFilter: (typeName, fieldName, argName) => isPublicName(argName),
      })
    )
  }
  transformRequest?: RequestTransform<T, TContext>
  transformResult?: ResultTransform<T, TContext>
}
