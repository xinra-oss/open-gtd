import { combineEpics } from 'redux-observable'
import { taskActions } from '../actions'
import { createDefaultApiEpic } from './api-default.epic'

const getTaskList = createDefaultApiEpic(taskActions.getTaskList, api =>
  api.getTaskList()
)

export const taskEpic = combineEpics(getTaskList)
