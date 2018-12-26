import { combineEpics } from 'redux-observable'
import { filter, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { routerActions, userActions } from '../actions'
import { createDefaultApiEpicWithPayloadAsBody } from './api-default.epic'

const createUser = createDefaultApiEpicWithPayloadAsBody(
  userActions.createUser,
  api => api.createUser
)

const createUserSuccess: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(userActions.createUser.success)),
    map(() => routerActions.push('/login'))
  )

export const userEpic = combineEpics(createUser, createUserSuccess)
