import { Reducer } from 'react'
import { AppAction } from '..'
import { AuthState } from '../state/auth.state'

const initialState: AuthState = {
  user: undefined
}

export const authReducer: Reducer<AuthState, AppAction> = (
  state = initialState,
  action
) => {
  return state
}
