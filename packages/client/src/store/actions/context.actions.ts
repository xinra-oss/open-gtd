import { Context, ContextEntity } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createContext = createAsyncAction(
  'CREATE_CONTEXT_REQUEST',
  'CREATE_CONTEXT_SUCCESS',
  'CREATE_CONTEXT_FAILURE'
)<Context, ContextEntity, Error>()
