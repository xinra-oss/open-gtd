import {
  HttpException,
  OpenGtdApi,
  TypedHttpException,
  UnauthorizedHttpException,
  ValidationException
} from '@open-gtd/api'
import Axios from 'axios'
import { createConsumer } from 'rest-ts-axios'
import { AppStore } from '../store'

const storeHolder = {
  store: {} as AppStore
}

const driver = Axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true
})
driver.interceptors.request.use(
  config => {
    const { csrfToken } = storeHolder.store.getState().session
    config.headers['CSRF-Token'] = csrfToken
    return config
  },
  err => Promise.reject(err)
)
driver.interceptors.response.use(res => res, handleOpenGtdApiError)

export const openGtdApi = {
  ...createConsumer(OpenGtdApi, driver),
  storeHolder
}

export type OpenGtdApiConsumer = typeof openGtdApi

function handleOpenGtdApiError(err: any) {
  // See https://github.com/axios/axios#handling-errors
  if (err.response) {
    // The request was made and the server responded with a non 2xx status code
    err = reconstructOriginalHttpException(err.response.data)
  }
  return Promise.reject(err)
}

type ClassType<T> = new (...args: any[]) => T

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
