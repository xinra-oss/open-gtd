import { combineEpics } from 'redux-observable'
import { of } from 'rxjs'
import { catchError, filter, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { syncActions } from '../actions'

const enableSync: AppEpic = (action$, state$, { sync }) =>
  action$.pipe(
    filter(isActionOf(syncActions.enableSync.request)),
    tap(() => sync.start()),
    map(syncActions.enableSync.success),
    catchError(err => of(syncActions.enableSync.failure(err)))
  )

export const syncEpic = combineEpics(enableSync)
