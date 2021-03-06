import { Credentials, EmptyResponse } from '@open-gtd/api'
import { createAsyncAction } from 'typesafe-actions'

export const createUser = createAsyncAction(
  'CREATE_USER_REQUEST',
  'CREATE_USER_SUCCESS',
  'CREATE_USER_FAILURE'
)<Credentials, EmptyResponse, Error>()
