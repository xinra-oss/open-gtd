import { combineEpics } from 'redux-observable'
import { filter, flatMap, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import {
  AppAction,
  loadingActions,
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
    flatMap(() => [
      routerActions.push('/login'),
      loadingActions.finishLoading()
    ])
  )

const getSession = createDefaultApiEpic(sessionActions.getSession, api =>
  api.getSession()
)

const getSessionSuccess: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(sessionActions.getSession.success)),
    flatMap(action => {
      if (action.payload.user !== undefined) {
        return [loadingActions.loadContent.request()]
      }
      const actions: AppAction[] = []
      if (!isCurrentPageLoginOrRegister(state$)) {
        actions.push(routerActions.push('/login'))
      }
      actions.push(loadingActions.finishLoading())
      return actions
    })
  )

export const authEpic = combineEpics(
  createSession,
  createSessionSuccess,
  deleteSession,
  deleteSessionSuccess,
  getSession,
  getSessionSuccess
)
