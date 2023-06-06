import type { Aggregation, GraphQL } from '../@types'

const aggregation: Aggregation = {
  model: 'Entity' as GraphQL.Model,
  pipeline: [
    {
      $match: {
        type: 'loan',
      },
    },
    {
      $project: {
        _id: 0,
        entityId: '$_id',
        entityType: '$type',
      },
    },
    {
      $lookup: {
        from: 'sources',
        localField: 'entityId',
        foreignField: 'entity',
        as: 'sources',
        pipeline: [
          {
            $match: {
              type: { $in: ['pod', 'chain', 'subql'] },
            },
          },
          {
            $project: {
              sourceId: '$_id',
              type: '$type',
              objectId: 1,
              _id: 0,
            },
          },
          {
            $lookup: {
              from: 'frames',
              localField: 'sourceId',
              foreignField: 'source',
              as: 'latestFrame',
              pipeline: [
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
                { $limit: 1 },
                {
                  $project: {
                    frameId: '$_id',
                    data: 1,
                    createdAt: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
          {
            $set: {
              latestFrame: { $ifNull: [{ $first: '$latestFrame' }, null] },
            },
          },
        ],
      },
    },
    {
      $set: {
        sources: {
          $arrayToObject: {
            $map: {
              input: '$sources',
              as: 'source',
              in: [
                '$$source.type',
                {
                  $unsetField: {
                    field: 'source',
                    input: '$$source',
                  },
                },
              ],
            },
          },
        },
      },
    },
  ],
}

export default aggregation
