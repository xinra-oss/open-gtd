import { Observable } from 'rxjs'
import { PayloadAction, PayloadCreator } from 'typesafe-actions/dist/types'
import { openGtdApi, OpenGtdApiConsumer } from './api.service'
import { antDesignInfo, InfoService } from './info.service'
import { SyncService } from './sync.service'

export type ApiErrorHandler = <T, CREATOR extends PayloadCreator<any, Error>>(
  failureActionCreator: CREATOR
) => (err: any, caught: Observable<T>) => Observable<PayloadAction<any, Error>>

export interface Services {
  openGtdApi: OpenGtdApiConsumer
  info: InfoService
  sync: SyncService
}

export { openGtdApi, antDesignInfo }
