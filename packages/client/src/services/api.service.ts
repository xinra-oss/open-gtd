import { OpenGtdApi } from '@open-gtd/api'
import Axios from 'axios'
import { createConsumer } from 'rest-ts-axios'
import { of } from 'rxjs'
import { ApiErrorHandler } from '.'

const driver = Axios.create({
  baseURL: 'http://localhost:3001/api'
})

export const openGtdApi = createConsumer(OpenGtdApi, driver)

export type OpenGtdApiConsumer = typeof openGtdApi

export const handleOpenGtdApiError: ApiErrorHandler = failureActionCreator => (
  err,
  caught
) => of(failureActionCreator(err))
