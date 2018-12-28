import { Credentials, Session } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createSession = createAsyncAction(
  'CREATE_SESSION_REQUEST',
  'CREATE_SESSION_SUCCESS',
  'CREATE_SESSION_FAILURE'
)<Credentials, Session, Error>()

export const deleteSession = createAsyncAction(
  'DELETE_SESSION_REQUEST',
  'DELETE_SESSION_SUCCESS',
  'DELETE_SESSION_FAILURE'
)<void, Session, Error>()

export const getSession = createAsyncAction(
  'GET_SESSION_REQUEST',
  'GET_SESSION_SUCCESS',
  'GET_SESSION_FAILURE'
)<void, Session, Error>()
