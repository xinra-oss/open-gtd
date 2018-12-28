import { combineEpics } from 'redux-observable'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { loadingActions, routerActions } from '../actions'
import { isCurrentPageLoginOrRegister } from './util'

const loadContent: AppEpic = (
  action$,
  state$,
  { openGtdApi, handleOpenGtdApiError }
) =>
  action$.pipe(
    filter(isActionOf(loadingActions.loadContent.request)),
    switchMap(async () => ({
      tasks: (await openGtdApi.getTaskList()).data,
      contexts: (await openGtdApi.getContextList()).data
    })),
    map(content => loadingActions.loadContent.success(content)),
    catchError(handleOpenGtdApiError(loadingActions.loadContent.failure))
  )

const loadContentSuccess: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(loadingActions.loadContent.success)),
    filter(() => isCurrentPageLoginOrRegister(state$)),
    map(() => routerActions.push('/'))
  )

export const loadingEpic = combineEpics(loadContent, loadContentSuccess)
