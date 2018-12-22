import { ActionType } from 'typesafe-actions'
import * as authActions from './auth.actions'
import * as userActions from './user.actions'

export type AppAction =
  | ActionType<typeof authActions>
  | ActionType<typeof userActions>

export type AppPayloadAction<P> = AppAction & { payload: P }

export { authActions, userActions }
