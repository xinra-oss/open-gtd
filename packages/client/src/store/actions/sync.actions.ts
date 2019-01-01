import { AppSyncEvent } from '@open-gtd/api'
import { createAsyncAction, createStandardAction } from 'typesafe-actions'

export const enableSync = createAsyncAction(
  'ENABLE_SYNC_REQUEST',
  'ENABLE_SYNC_SUCCESS',
  'ENABLE_SYNC_FAILURE'
)<void, void, Error>()

export const receivedSyncEvent = createStandardAction('RECEIVED_SYNC_EVENT')<
  AppSyncEvent
>()
