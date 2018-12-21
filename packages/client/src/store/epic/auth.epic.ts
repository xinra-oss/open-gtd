import { combineEpics } from 'redux-observable'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { authActions } from '../actions'

const createSession: AppEpic = (
  action$,
  state$,
  { openGtdApi, handleOpenGtdApiError }
) =>
  action$.pipe(
    filter(isActionOf(authActions.createSession.request)),
    switchMap(action => openGtdApi.createSession({ body: action.payload })),
    map(res => authActions.createSession.success()),
    catchError(handleOpenGtdApiError(authActions.createSession.failure))
  )

const deleteSession: AppEpic = (
  action$,
  state$,
  { openGtdApi, handleOpenGtdApiError }
) =>
  action$.pipe(
    filter(isActionOf(authActions.deleteSession.request)),
    switchMap(action => openGtdApi.deleteSession()),
    map(res => authActions.deleteSession.success()),
    catchError(handleOpenGtdApiError(authActions.deleteSession.failure))
  )

export const authEpic = combineEpics(createSession, deleteSession)
