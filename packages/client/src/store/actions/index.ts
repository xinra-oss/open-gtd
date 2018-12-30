import { RouterAction, routerActions } from 'connected-react-router'
import { ActionType, createStandardAction } from 'typesafe-actions'
import * as contextActions from './context.actions'
import * as loadingActions from './loading.actions'
import * as sessionActions from './session.actions'
import * as taskActions from './task.actions'
import * as userActions from './user.actions'

export const noopAction = createStandardAction('NO_OP')()

export type AppAction =
  | ActionType<typeof noopAction>
  | ActionType<typeof sessionActions>
  | ActionType<typeof userActions>
  | ActionType<typeof taskActions>
  | ActionType<typeof contextActions>
  | ActionType<typeof loadingActions>
  | RouterAction

export type AppPayloadAction<P> = AppAction & { payload: P }

export {
  sessionActions,
  userActions,
  routerActions,
  taskActions,
  contextActions,
  loadingActions
}
