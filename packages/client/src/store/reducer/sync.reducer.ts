import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { syncActions } from '../actions'
import { SyncState } from '../state/sync.state'

export const syncReducer: Reducer<SyncState, AppAction> = (
  state = 'DISABLED',
  action
) => {
  switch (action.type) {
    case getType(syncActions.enableSync.success):
      return 'ENABLED'
    case getType(syncActions.enableSync.failure):
      return 'NOT_SUPPORTED'
  }
  return state
}
