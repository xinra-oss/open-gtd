import { produce } from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { loadingActions } from '../actions'
import { TaskState } from '../state/task.state'

export const taskReducer: Reducer<TaskState, AppAction> = (
  state = [],
  action
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(loadingActions.loadContent.success):
        return action.payload.tasks
    }
    return
  })
