import { combineEpics } from 'redux-observable'
import { contextActions } from '../actions'
import { createDefaultApiEpicWithPayloadAsBody } from './util'

const createContext = createDefaultApiEpicWithPayloadAsBody(
  contextActions.createContext,
  api => api.createContext
)

export const contextEpic = combineEpics(createContext)
