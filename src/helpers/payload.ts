import { STATUS_CODES } from 'http'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ApiPayload<Data = any> implements Api.Payload<Data> {
  statusCode: number
  status: string
  message: string
  data?: Data
  count?: number
  next?: string

  constructor(
    statusCode: Api.Payload['statusCode'],
    message?: Api.Payload['message'],
    data?: Api.Payload['data'],
    count?: Api.Payload['count'],
    next?: Api.Payload['next']
  ) {
    this.statusCode = statusCode
    this.status = STATUS_CODES[statusCode] || 'Unspecified Status Code'
    this.message = message || this.status
    if (data !== undefined) this.data = data
    if (count !== undefined) this.count = count
    if (next !== undefined) this.next = next
  }
}
