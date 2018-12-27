import { produce } from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { authActions } from '../actions'
import { AuthState } from '../state/auth.state'

const initialState: AuthState = {
  user: undefined
}

export const authReducer: Reducer<AuthState, AppAction> = (
  state = initialState,
  action
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(authActions.createSession.success):
        draft.user = action.payload
        break
      case getType(authActions.deleteSession.success):
        draft.user = undefined
        break
    }
  })
}
