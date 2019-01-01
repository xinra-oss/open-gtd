import { Context, ContextEntity, Entity, EntityId } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createContext = createAsyncAction(
  'CREATE_CONTEXT_REQUEST',
  'CREATE_CONTEXT_SUCCESS',
  'CREATE_CONTEXT_FAILURE'
)<Context, ContextEntity, Error>()

export const updateContext = createAsyncAction(
  'UPDATE_CONTEXT_REQUEST',
  'UPDATE_CONTEXT_SUCCESS',
  'UPDATE_CONTEXT_FAILURE'
)<ContextEntity, ContextEntity, Error>()

export const deleteContext = createAsyncAction(
  'DELETE_CONTEXT_REQUEST',
  'DELETE_CONTEXT_SUCCESS',
  'DELETE_CONTEXT_FAILURE'
)<EntityId, Entity[], Error>()
