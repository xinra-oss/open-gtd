import { combineEpics } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, filter, flatMap, map, mergeMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { OpenGtdApiConsumer } from '../../services/api.service'
import {
  AppAction,
  loadingActions,
  routerActions,
  syncActions
} from '../actions'
import { isCurrentPageLoginOrRegister } from './util'

const loadContent: AppEpic = (action$, state$, { openGtdApi }) =>
  action$.pipe(
    filter(isActionOf(loadingActions.loadContent.request)),
    mergeMap(() =>
      from(loadContentFromApi(openGtdApi)).pipe(
        map(content => loadingActions.loadContent.success(content)),
        catchError(err => of(loadingActions.loadContent.failure(err)))
      )
    )
  )

async function loadContentFromApi(openGtdApi: OpenGtdApiConsumer) {
  return {
    tasks: (await openGtdApi.getTaskList()).data,
    contexts: (await openGtdApi.getContextList()).data
  }
}

const loadContentSuccess: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(loadingActions.loadContent.success)),
    flatMap(() => {
      const actions: AppAction[] = []
      if (isCurrentPageLoginOrRegister(state$)) {
        actions.push(routerActions.push('/'))
      }
      actions.push(loadingActions.finishLoading())
      actions.push(syncActions.enableSync.request())
      return actions
    })
  )

export const loadingEpic = combineEpics(loadContent, loadContentSuccess)
