import { Entity, TaskEntity } from '@open-gtd/api'
import { Draft, produce } from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import {
  contextActions,
  loadingActions,
  syncActions,
  taskActions
} from '../actions'
import { TaskState } from '../state/task.state'

export const taskReducer: Reducer<TaskState, AppAction> = (
  state = [],
  action
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(loadingActions.loadContent.success):
        return action.payload.tasks
      case getType(syncActions.receivedSyncEvent):
        if (action.payload.payloadType === 'task') {
          switch (action.payload.eventType) {
            case 'create':
              return createTask(draft, action.payload.payload)
            case 'update':
              return updateTask(draft, action.payload.payload)
            case 'delete':
              return deleteTask(draft, action.payload.payload)
          }
        } else if (
          action.payload.payloadType === 'context' &&
          action.payload.eventType === 'delete'
        ) {
          return removeContextReferences(draft, action.payload.payload)
        }
        break
      case getType(taskActions.createTask.success):
        return createTask(draft, action.payload)
      case getType(taskActions.updateTask.success):
        return updateTask(draft, action.payload)
      case getType(taskActions.deleteTask.success):
        return deleteTask(draft, action.payload)
      case getType(contextActions.deleteContext.success):
        return removeContextReferences(draft, action.payload)
    }
    return
  })

type CrudHandler<T = TaskEntity> = (
  draft: Draft<TaskState>,
  payload: T
) => TaskState

const createTask: CrudHandler = (draft, task) => {
  if (draft.find(t => t._id === task._id) === undefined) {
    draft.push(task)
  }
  return draft
}

const updateTask: CrudHandler = (draft, newTask) => {
  const oldIndex = draft.findIndex(t => t._id === newTask._id)
  if (oldIndex > -1) {
    draft[oldIndex] = newTask
  }
  return draft
}

const deleteTask: CrudHandler<Entity[]> = (draft, tasks) => {
  tasks.forEach(task => {
    const index = draft.findIndex(t => t._id === task._id)
    if (index > -1) {
      draft.splice(index, 1)
    }
  })
  return draft
}

const removeContextReferences: CrudHandler<Entity[]> = (draft, contexts) => {
  draft.forEach(task => {
    contexts.forEach(context => {
      const index = task.contextIds.findIndex(id => id === context._id)
      if (index > -1) {
        task.contextIds.splice(index, 1)
      }
    })
  })
  return draft
}
