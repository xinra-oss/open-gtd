import { combineEpics } from 'redux-observable'
import { authActions } from '../actions'
import {
  createDefaultApiEpic,
  createDefaultApiEpicWithPayloadAsBody
} from './api-default.epic'

const createSession = createDefaultApiEpicWithPayloadAsBody(
  authActions.createSession,
  api => api.createSession
)

const deleteSession = createDefaultApiEpic(authActions.deleteSession, api =>
  api.deleteSession()
)

export const authEpic = combineEpics(createSession, deleteSession)
