import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'
import { AppAction, AppState } from '../'
import { authReducer } from './auth.reducer'

export const createAppReducer = (history: History) =>
  combineReducers<AppState, AppAction>({
    router: connectRouter(history),
    auth: authReducer
  })
