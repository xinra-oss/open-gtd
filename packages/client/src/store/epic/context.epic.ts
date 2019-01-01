import { combineEpics } from 'redux-observable'
import { contextActions } from '../actions'
import {
  createDefaultCreateEntityApiEpic,
  createDefaultDeleteEntityApiEpic,
  createDefaultUpdateEntityApiEpic
} from './util'

const createContext = createDefaultCreateEntityApiEpic(
  contextActions.createContext,
  api => api.createContext
)

const updateContext = createDefaultUpdateEntityApiEpic(
  contextActions.updateContext,
  api => api.updateContext,
  ['userId']
)

const deleteContext = createDefaultDeleteEntityApiEpic(
  contextActions.deleteContext,
  api => api.deleteContext
)

export const contextEpic = combineEpics(
  createContext,
  updateContext,
  deleteContext
)
