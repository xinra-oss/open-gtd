import { Observable } from 'rxjs'
import { PayloadAction, PayloadCreator } from 'typesafe-actions/dist/types'
import {
  handleOpenGtdApiError,
  openGtdApi,
  OpenGtdApiConsumer
} from './api.service'
import { antDesignFeedback, FeedbackService } from './feedback.service'

export type ApiErrorHandler = <T, CREATOR extends PayloadCreator<any, Error>>(
  failureActionCreator: CREATOR
) => (err: any, caught: Observable<T>) => Observable<PayloadAction<any, Error>>

export interface Services {
  openGtdApi: OpenGtdApiConsumer
  handleOpenGtdApiError: ApiErrorHandler
  feedback: FeedbackService
}

export { openGtdApi, handleOpenGtdApiError, antDesignFeedback }
