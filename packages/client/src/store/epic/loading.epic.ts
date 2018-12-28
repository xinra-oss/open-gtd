import { combineEpics } from 'redux-observable'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { loadingActions } from '../actions'

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

export const loadingEpic = combineEpics(loadContent)
