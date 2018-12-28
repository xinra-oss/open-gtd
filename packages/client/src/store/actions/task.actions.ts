import { TaskEntity } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const getTaskList = createAsyncAction(
  'GET_TASK_LIST_REQUEST',
  'GET_TASK_LIST_SUCCESS',
  'GET_TASK_LIST_FAILURE'
)<void, TaskEntity[], Error>()
