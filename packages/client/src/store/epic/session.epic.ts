import { LOCATION_CHANGE } from 'connected-react-router'
import { combineEpics } from 'redux-observable'
import { filter, flatMap, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { loadingActions, routerActions, sessionActions } from '../actions'
import {
  createDefaultApiEpic,
  createDefaultApiEpicWithPayloadAsBody
} from './api-default.epic'

const createSession = createDefaultApiEpicWithPayloadAsBody(
  sessionActions.createSession,
  api => api.createSession
)

const createSessionSuccess: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(sessionActions.createSession.success)),
    flatMap(() => [
      routerActions.push('/'),
      loadingActions.loadContent.request()
    ])
  )

const deleteSession = createDefaultApiEpic(sessionActions.deleteSession, api =>
  api.deleteSession()
)

const deleteSessionSuccess: AppEpic = (action$, _, { feedback }) =>
  action$.pipe(
    filter(isActionOf(sessionActions.deleteSession.success)),
    tap(() => feedback.successMessage("You've been successfully signed out.")),
    map(() => routerActions.push('/login'))
  )

const getSession = createDefaultApiEpic(sessionActions.getSession, api =>
  api.getSession()
)

const getSessionSuccess: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(sessionActions.getSession.success)),
    filter(action => action.payload.user !== undefined),
    map(loadingActions.loadContent.request)
  )

const redirectToLogin: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(
      action =>
        action.type === LOCATION_CHANGE &&
        action.payload.location.pathname !== '/login' &&
        action.payload.location.pathname !== '/register' &&
        state$.value.session.user === undefined
    ),
    map(() => routerActions.push('/login'))
  )

export const authEpic = combineEpics(
  createSession,
  createSessionSuccess,
  deleteSession,
  deleteSessionSuccess,
  getSession,
  getSessionSuccess,
  redirectToLogin
)
