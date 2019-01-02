import { RouterAction, routerActions } from 'connected-react-router'
import { ActionType } from 'typesafe-actions'
import * as contextActions from './context.actions'
import * as infoAction from './info.action'
import * as loadingActions from './loading.actions'
import * as sessionActions from './session.actions'
import * as syncActions from './sync.actions'
import * as taskActions from './task.actions'
import * as userActions from './user.actions'

export type AppAction =
  | ActionType<typeof sessionActions>
  | ActionType<typeof userActions>
  | ActionType<typeof taskActions>
  | ActionType<typeof contextActions>
  | ActionType<typeof loadingActions>
  | ActionType<typeof syncActions>
  | ActionType<typeof infoAction>
  | RouterAction

export type AppPayloadAction<P> = AppAction & { payload: P }

export {
  sessionActions,
  userActions,
  routerActions,
  taskActions,
  contextActions,
  loadingActions,
  syncActions,
  infoAction
}
