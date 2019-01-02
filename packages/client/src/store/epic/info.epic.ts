import { ValidationException } from '@open-gtd/api'
import { combineEpics } from 'redux-observable'
import { of } from 'rxjs'
import { filter, switchMap } from 'rxjs/operators'
import { AppEpic } from '.'
import { infoAction } from '../actions'
import { noopAction } from './util'

const handleAsyncErrors: AppEpic = (action$, state$, { info }) =>
  action$.pipe(
    filter(action => action.type.endsWith('_FAILURE')),
    switchMap(action => {
      if ('payload' in action) {
        if (action.payload instanceof ValidationException) {
          return of(infoAction.setValidationErrors(action.payload.errors))
        } else if (action.payload instanceof Error && action.payload.message) {
          info.errorMessage(action.payload.message)
        } else {
          info.errorMessage('An unknown error occured.')
          // show error to advanced users
          // tslint:disable-next-line
          console.error(action.payload)
        }
      }
      return noopAction()
    })
  )

export const infoEpic = combineEpics(handleAsyncErrors)
