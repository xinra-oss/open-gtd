import { Entity, EntityId, Task, TaskEntity } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createTask = createAsyncAction(
  'CREATE_TASK_REQUEST',
  'CREATE_TASK_SUCCESS',
  'CREATE_TASK_FAILURE'
)<Task, TaskEntity, Error>()

export const updateTask = createAsyncAction(
  'UPDATE_TASK_REQUEST',
  'UPDATE_TASK_SUCCESS',
  'UPDATE_TASK_FAILURE'
)<TaskEntity, TaskEntity, Error>()

export const deleteTask = createAsyncAction(
  'DELETE_TASK_REQUEST',
  'DELETE_TASK_SUCCESS',
  'DELETE_TASK_FAILURE'
)<EntityId, Entity[], Error>()
