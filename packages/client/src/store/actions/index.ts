import { ActionType } from 'typesafe-actions'
import * as authActions from './auth.actions'
import * as userActions from './user.actions'

export type AppAction =
  | ActionType<typeof authActions>
  | ActionType<typeof userActions>

export { authActions, userActions }
