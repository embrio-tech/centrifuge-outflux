import type { Types } from 'mongoose'

export type WithId<ISchema> = ISchema & { _id: Types.ObjectId }
