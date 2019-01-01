import { produce } from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { arrayToDictionary } from '../../util'
import { loadingActions, syncActions } from '../actions'
import { ContextState } from '../state/context.state'

export const contextReducer: Reducer<ContextState, AppAction> = (
  state = {},
  action
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(loadingActions.loadContent.success):
        return arrayToDictionary(action.payload.contexts, c => c._id)
      case getType(syncActions.receivedSyncEvent):
        if (action.payload.payloadType === 'context') {
          switch (action.payload.eventType) {
            case 'create':
            case 'update':
              draft[action.payload.payload._id] = action.payload.payload
              break
            case 'delete':
              action.payload.payload.forEach(c => delete draft[c._id])
              break
          }
        }
        break
    }
    return
  })
