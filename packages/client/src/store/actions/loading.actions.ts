import { ContextEntity, TaskEntity } from '@open-gtd/api'
import { createAsyncAction, createStandardAction } from 'typesafe-actions'

export interface Content {
  tasks: TaskEntity[]
  contexts: ContextEntity[]
}

export const loadContent = createAsyncAction(
  'LOAD_CONTENT_REQUEST',
  'LOAD_CONTENT_SUCCESS',
  'LOAD_CONTENT_FAILURE'
)<void, Content, Error>()

export const finishLoading = createStandardAction('FINISH_LOADING')()
