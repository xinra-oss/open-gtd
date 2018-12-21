import { combineEpics } from 'redux-observable'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { userActions } from '../actions'

const createUser: AppEpic = (
  action$,
  state$,
  { openGtdApi, handleOpenGtdApiError }
) =>
  action$.pipe(
    filter(isActionOf(userActions.createUser.request)),
    switchMap(action => openGtdApi.createUser({ body: action.payload })),
    map(res => userActions.createUser.success(res.data)),
    catchError(handleOpenGtdApiError(userActions.createUser.failure))
  )

export const userEpic = combineEpics(createUser)
