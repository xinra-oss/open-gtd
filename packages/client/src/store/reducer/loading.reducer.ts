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
      return true
    case getType(loadingActions.loadContent.success):
    case getType(sessionActions.getSession.success):
      return false
  }
  return state
}
