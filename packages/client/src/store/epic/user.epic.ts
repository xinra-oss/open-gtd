import { combineEpics } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { userActions } from '../actions'

const createUser: AppEpic = (action$, state$, { openGtdApi }) =>
  action$.pipe(
    filter(isActionOf(userActions.createUser.request)),
    switchMap(action =>
      from(openGtdApi.createUser({ body: action.payload })).pipe(
        map(res => userActions.createUser.success(res.data)),
        catchError(err => of(userActions.createUser.failure(err)))
      )
    )
  )

export const userEpic = combineEpics(createUser)
