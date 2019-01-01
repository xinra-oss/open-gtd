import { combineEpics } from 'redux-observable'
import { taskActions } from '../actions'
import {
  createDefaultCreateEntityApiEpic,
  createDefaultDeleteEntityApiEpic,
  createDefaultUpdateEntityApiEpic
} from './util'

const createTask = createDefaultCreateEntityApiEpic(
  taskActions.createTask,
  api => api.createTask
)

const updateTask = createDefaultUpdateEntityApiEpic(
  taskActions.updateTask,
  api => api.updateTask,
  ['userId']
)

const deleteTask = createDefaultDeleteEntityApiEpic(
  taskActions.deleteTask,
  api => api.deleteTask
)

export const taskEpic = combineEpics(createTask, updateTask, deleteTask)
