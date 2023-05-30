// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Api {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface Payload<Data = any> {
    statusCode: number
    status: string
    message: string
    data?: Data
    count?: number
    next?: string
  }
}
