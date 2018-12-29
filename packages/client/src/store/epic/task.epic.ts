import { combineEpics } from 'redux-observable'
import { taskActions } from '../actions'
import { createDefaultApiEpicWithPayloadAsBody } from './util'

const createTask = createDefaultApiEpicWithPayloadAsBody(
  taskActions.createTask,
  api => api.createTask
)

export const taskEpic = combineEpics(createTask)
