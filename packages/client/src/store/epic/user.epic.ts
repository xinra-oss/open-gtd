import { combineEpics } from 'redux-observable'
import { filter, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { routerActions, userActions } from '../actions'
import { createDefaultApiEpicWithPayloadAsBody } from './api-default.epic'

const createUser = createDefaultApiEpicWithPayloadAsBody(
  userActions.createUser,
  api => api.createUser
)

const createUserSuccess: AppEpic = (action$, _, { feedback }) =>
  action$.pipe(
    filter(isActionOf(userActions.createUser.success)),
    tap(() =>
      feedback.successMessage(
        'Your account has been created successfully. You can now use it to log in.',
        10
      )
    ),
    map(() => routerActions.push('/login'))
  )

export const userEpic = combineEpics(createUser, createUserSuccess)
