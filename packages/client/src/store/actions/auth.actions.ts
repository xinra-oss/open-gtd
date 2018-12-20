import { Credentials, HttpException } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createSession = createAsyncAction(
  'CREATE_SESSION_REQUEST',
  'CREATE_SESSION_SUCCESS',
  'CREATE_SESSION_FAILURE'
)<Credentials, void, HttpException>()

export const deleteSession = createAsyncAction(
  'DELETE_SESSION_REQUEST',
  'DELETE_SESSION_SUCCESS',
  'DELETE_SESSION_FAILURE'
)<void, void, HttpException>()
