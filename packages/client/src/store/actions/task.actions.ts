import { Task, TaskEntity } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createTask = createAsyncAction(
  'CREATE_TASK_REQUEST',
  'CREATE_TASK_SUCCESS',
  'CREATE_TASK_FAILURE'
)<Task, TaskEntity, Error>()
