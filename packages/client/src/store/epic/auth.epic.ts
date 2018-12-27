import { LOCATION_CHANGE } from 'connected-react-router'
import { combineEpics } from 'redux-observable'
import { filter, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { authActions, routerActions } from '../actions'
import {
  createDefaultApiEpic,
  createDefaultApiEpicWithPayloadAsBody
} from './api-default.epic'

const createSession = createDefaultApiEpicWithPayloadAsBody(
  authActions.createSession,
  api => api.createSession
)

const createSessionSuccess: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(authActions.createSession.success)),
    map(() => routerActions.push('/'))
  )

const deleteSession = createDefaultApiEpic(authActions.deleteSession, api =>
  api.deleteSession()
)

const deleteSessionSuccess: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(authActions.deleteSession.success)),
    map(() => routerActions.push('/login'))
  )

const redirectToLogin: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(
      action =>
        action.type === LOCATION_CHANGE &&
        action.payload.location.pathname !== '/login' &&
        action.payload.location.pathname !== '/register' &&
        state$.value.auth.user === undefined
    ),
    map(() => routerActions.push('/login'))
  )

export const authEpic = combineEpics(
  createSession,
  createSessionSuccess,
  deleteSession,
  deleteSessionSuccess,
  redirectToLogin
)
