import { combineEpics } from 'redux-observable'
import { userActions } from '../actions'
import { createDefaultApiEpicWithPayloadAsBody } from './api-default.epic'

const createUser = createDefaultApiEpicWithPayloadAsBody(
  userActions.createUser,
  api => api.createUser
)

export const userEpic = combineEpics(createUser)
