import { produce } from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { arrayToDictionary } from '../../util'
import { loadingActions } from '../actions'
import { ContextState } from '../state/context.state'

export const contextReducer: Reducer<ContextState, AppAction> = (
  state = {},
  action
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(loadingActions.loadContent.success):
        return arrayToDictionary(action.payload.contexts, c => c._id)
    }
    return
  })
