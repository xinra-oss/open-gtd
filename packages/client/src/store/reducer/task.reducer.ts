import { Entity } from '@open-gtd/api'
import { Draft, produce } from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { arrayToDictionary } from '../../util'
import {
  contextActions,
  loadingActions,
  syncActions,
  taskActions
} from '../actions'
import { TaskState } from '../state/task.state'

export const taskReducer: Reducer<TaskState, AppAction> = (
  state = {},
  action
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(loadingActions.loadContent.success):
        return arrayToDictionary(action.payload.tasks, t => t._id)
      case getType(syncActions.receivedSyncEvent):
        if (action.payload.payloadType === 'task') {
          switch (action.payload.eventType) {
            case 'create':
            case 'update':
              draft[action.payload.payload._id] = action.payload.payload
              break
            case 'delete':
              action.payload.payload.forEach(t => delete draft[t._id])
              break
          }
        } else if (
          action.payload.payloadType === 'context' &&
          action.payload.eventType === 'delete'
        ) {
          return removeContextReferences(draft, action.payload.payload)
        }
        break
      case getType(taskActions.createTask.success):
      case getType(taskActions.updateTask.success):
        draft[action.payload._id] = action.payload
        break
      case getType(taskActions.deleteTask.success):
        action.payload.forEach(t => delete draft[t._id])
        break
      case getType(contextActions.deleteContext.success):
        return removeContextReferences(draft, action.payload)
    }
    return
  })

const removeContextReferences = (
  draft: Draft<TaskState>,
  contexts: Entity[]
) => {
  Object.keys(draft).forEach(taskId => {
    const task = draft[taskId]
    contexts.forEach(context => {
      const index = task.contextIds.findIndex(id => id === context._id)
      if (index > -1) {
        task.contextIds.splice(index, 1)
      }
    })
  })
  return draft
}
