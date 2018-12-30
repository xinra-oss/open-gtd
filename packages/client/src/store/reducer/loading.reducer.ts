import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { loadingActions, sessionActions } from '../actions'

export const loadingReducer: Reducer<boolean, AppAction> = (
  state = true,
  action
) => {
  switch (action.type) {
    case getType(loadingActions.loadContent.request):
    case getType(sessionActions.deleteSession.request):
      return true
    case getType(loadingActions.finishLoading):
      return false
  }
  return state
}
