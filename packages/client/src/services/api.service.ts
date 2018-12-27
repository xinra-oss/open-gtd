import {
  HttpException,
  OpenGtdApi,
  TypedHttpException,
  UnauthorizedHttpException,
  ValidationException
} from '@open-gtd/api'
import Axios from 'axios'
import { Store } from 'redux'
import { createConsumer } from 'rest-ts-axios'
import { of } from 'rxjs'
import { ApiErrorHandler } from '.'
import { AppAction, AppState } from '../store'

const storeHolder = {
  store: {} as Store<AppState, AppAction>
}

const driver = Axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
  transformRequest: [
    (data, headers) => {
      headers['Content-Type'] = 'application/json'
      headers['CSRF-Token'] = storeHolder.store.getState().session.csrfToken
      return JSON.stringify(data)
    }
  ]
})

export const openGtdApi = {
  ...createConsumer(OpenGtdApi, driver),
  storeHolder
}

export type OpenGtdApiConsumer = typeof openGtdApi

export const handleOpenGtdApiError: ApiErrorHandler = failureActionCreator => (
  err,
  caught
) => {
  // See https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
  if (err.response) {
    // The request was made and the server responded with a non 2xx status code
    err = reconstructOriginalHttpException(err.response.data)
  }
  return of(failureActionCreator(err))
}

interface ClassType<T> {
  new (...args: any[]): T
}

/**
 * Exception types that should recustructed. Every other `TypedException` is
 * turned into an `HttpException`.
 */
const RECONSTRUCTABLE_HTTP_EXCEPTIONS: ReadonlyArray<
  ClassType<HttpException>
> = [HttpException, ValidationException, UnauthorizedHttpException]

/**
 * Creates an instance of the original exception type that can be used with
 * `instanceof`.
 */
function reconstructOriginalHttpException(
  typedException: TypedHttpException
): HttpException {
  let reconstructedType: ClassType<HttpException> | undefined
  for (const reconstructableType of RECONSTRUCTABLE_HTTP_EXCEPTIONS) {
    if (reconstructableType.name === typedException.type) {
      reconstructedType = reconstructableType
    }
  }
  const reconstructedException = { ...typedException }
  if (reconstructedType === undefined) {
    reconstructedType = HttpException
    // tslint:disable-next-line
    reconstructedException['__NOTE'] = `This error was originally of type ${
      typedException.type
    } but has been reconstructed to HttpException. If you want to reconstruct the original type, add it to ${
      Object.keys({ RECONSTRUCTABLE_HTTP_EXCEPTIONS })[0]
    } in services/api.service.ts`
  }
  delete reconstructedException.type
  Object.setPrototypeOf(reconstructedException, reconstructedType.prototype)
  return (reconstructedException as unknown) as HttpException
}
