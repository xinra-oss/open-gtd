import { combineEpics } from 'redux-observable'
import { filter, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { routerActions, userActions } from '../actions'
import { createDefaultCreateEntityApiEpic } from './util'

const createUser = createDefaultCreateEntityApiEpic(
  userActions.createUser,
  api => api.createUser
)

const createUserSuccess: AppEpic = (action$, _, { info }) =>
  action$.pipe(
    filter(isActionOf(userActions.createUser.success)),
    tap(() =>
      info.successMessage(
        'Your account has been created successfully. You can now use it to log in.',
        5
      )
    ),
    map(() => routerActions.push('/login'))
  )

export const userEpic = combineEpics(createUser, createUserSuccess)
