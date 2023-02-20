// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiPayload<Data = any> {
  statusCode: number
  status: string
  message: string
  data?: Data
  count?: number
  next?: string
}
