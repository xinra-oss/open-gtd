import { RouterAction, routerActions } from 'connected-react-router'
import { ActionType } from 'typesafe-actions'
import * as sessionActions from './session.actions'
import * as taskActions from './task.actions'
import * as userActions from './user.actions'

export type AppAction =
  | ActionType<typeof sessionActions>
  | ActionType<typeof userActions>
  | ActionType<typeof taskActions>
  | RouterAction

export type AppPayloadAction<P> = AppAction & { payload: P }

export { sessionActions, userActions, routerActions, taskActions }
