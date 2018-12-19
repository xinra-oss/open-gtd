// import { HttpException } from '@senhung/http-exceptions'

export interface TypedHttpException {
  /**
   * Class name of the original exception. The class either comes from
   * `@senhung/http-exceptions` or `@open-gtd/api/model/error`.
   */
  type: string
  statusCode: number
  message?: string
}
