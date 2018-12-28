import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'
import { AppAction, AppState } from '../'
import { sessionReducer } from './session.reducer'
import { taskReducer } from './task.reducer'

export const createAppReducer = (history: History) =>
  combineReducers<AppState, AppAction>({
    router: connectRouter(history),
    session: sessionReducer,
    tasks: taskReducer
  })
