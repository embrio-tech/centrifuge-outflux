import type { GraphQL } from '../@types'

interface DBListQuery {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: Record<string, any>
  skip: number
  limit: number
  sort?: Record<string, 1 | -1> | undefined
}

export function prepareDBQuery(query: GraphQL.ListQuery): DBListQuery {
  const { filter = {}, sort: _sort, skip: _skip, limit: _limit } = query || {}

    const skip = _skip ?? 0
    const limit = _limit ?? 10
    const sortMap: Record<GraphQL.SortDirection, 1 | -1> = {
      asc: 1,
      desc: -1,
    }
    const sort = _sort
      ? {
          [_sort.key]: sortMap[_sort.dir],
        }
      : undefined
  return { filter, skip, limit, sort }
}
