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
  createDefaultCreateEntityApiEpic,
  isCurrentPageLoginOrRegister
} from './util'

const createSession = createDefaultCreateEntityApiEpic(
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

const deleteSessionSuccess: AppEpic = (action$, _, { info }) =>
  action$.pipe(
    filter(isActionOf(sessionActions.deleteSession.success)),
    tap(() => info.successMessage("You've been successfully signed out.")),
    flatMap(() => [
      routerActions.replace('/login'),
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
        actions.push(routerActions.replace('/login'))
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
