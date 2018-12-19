import { HttpException } from '@senhung/http-exceptions'

export type TypedException<T extends HttpException> = T & {
  type: string
}
