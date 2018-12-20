import { combineReducers } from 'redux'
import { AppAction, AppState } from '../'
import { authReducer } from './auth.reducer'

export const appReducer = combineReducers<AppState, AppAction>({
  auth: authReducer
})
