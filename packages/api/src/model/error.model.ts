import { UnprocessableEntityHttpException } from '@senhung/http-exceptions'

export interface TypedHttpException {
  /**
   * Class name of the original exception which must be an exported
   * type of `@open-gtd/api/model/error`.
   */
  type: string
  statusCode: number
  message: string
}

export type ValidationErrors<T> = { [KEY in keyof T]?: string | string[] }

export class ValidationException<T> extends UnprocessableEntityHttpException {
  public errors: ValidationErrors<T>

  constructor(errors: ValidationErrors<T> = {}) {
    super()
    this.errors = errors
  }
}

// this is needed for `instanceof` to work correctly
export * from '@senhung/http-exceptions'
