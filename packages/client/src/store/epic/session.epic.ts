import { combineEpics } from 'redux-observable'
import { filter, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import {
  loadingActions,
  noopAction,
  routerActions,
  sessionActions
} from '../actions'
import {
  createDefaultApiEpic,
  createDefaultApiEpicWithPayloadAsBody,
  isCurrentPageLoginOrRegister
} from './util'

const createSession = createDefaultApiEpicWithPayloadAsBody(
  sessionActions.createSession,
  api => api.createSession
)

const createSessionSuccess: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(sessionActions.createSession.success)),
    map(loadingActions.loadContent.request)
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

const getSessionSuccess: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(sessionActions.getSession.success)),
    map(action =>
      action.payload.user !== undefined
        ? loadingActions.loadContent.request()
        : isCurrentPageLoginOrRegister(state$)
        ? noopAction()
        : routerActions.push('/login')
    )
  )

export const authEpic = combineEpics(
  createSession,
  createSessionSuccess,
  deleteSession,
  deleteSessionSuccess,
  getSession,
  getSessionSuccess
)
