import { HttpException } from '@open-gtd/api'
import { combineEpics } from 'redux-observable'
import { filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { userActions } from '../actions'

const createUser: AppEpic = (action$, state$, { openGtdApi }) =>
  action$.pipe(
    filter(isActionOf(userActions.createUser.request)),
    switchMap(action => openGtdApi.createUser({ body: action.payload })),
    map(res => {
      if (res.status === 200) {
        return userActions.createUser.success(res.data)
      }
      return userActions.createUser.failure(
        (res.data as unknown) as HttpException
      )
    })
  )

export const userEpic = combineEpics(createUser)
