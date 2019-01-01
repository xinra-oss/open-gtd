import { Entity, EntityId } from '@open-gtd/api'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { AppState } from '..'
import { OpenGtdApiConsumer } from '../../services/api.service'
import { AC } from '../action-creator'
import { AppAction, AppPayloadAction } from '../actions'

export const isCurrentPageLoginOrRegister = (state$: { value: AppState }) =>
  ['/login', '/register'].indexOf(state$.value.router.location.pathname) > -1

interface ApiActionCreator<REQ_AC extends AC<AppAction>, OUT> {
  request: REQ_AC
  success: (result: OUT) => AppPayloadAction<OUT>
  failure: (err: Error) => AppPayloadAction<Error>
}

export function createDefaultApiEpic<REQ_A extends AppAction, OUT>(
  apiActionCreator: ApiActionCreator<AC<REQ_A>, OUT>,
  mapActionToApiResult: (
    openGtdApi: OpenGtdApiConsumer,
    action: REQ_A
  ) => Promise<{ data: OUT }>
): AppEpic {
  return (action$, state$, { openGtdApi, handleOpenGtdApiError }) =>
    action$.pipe(
      filter(isActionOf(apiActionCreator.request)),
      switchMap(action => mapActionToApiResult(openGtdApi, action)),
      map(res => apiActionCreator.success(res.data)),
      catchError(handleOpenGtdApiError(apiActionCreator.failure))
    )
}

export function createDefaultCreateEntityApiEpic<IN, OUT>(
  apiActionCreator: ApiActionCreator<AC<AppPayloadAction<IN>>, OUT>,
  apiMethodSelector: (
    openGtdApi: OpenGtdApiConsumer
  ) => (params: { body: IN }) => Promise<{ data: OUT }>
): AppEpic {
  return createDefaultApiEpic(apiActionCreator, (openGtdApi, action) =>
    apiMethodSelector(openGtdApi)({ body: action.payload })
  )
}

export function createDefaultUpdateEntityApiEpic<T, TE extends T & Entity>(
  apiActionCreator: ApiActionCreator<AC<AppPayloadAction<TE>>, TE>,
  apiMethodSelector: (
    openGtdApi: OpenGtdApiConsumer
  ) => (params: { body: T; params: { id: EntityId } }) => Promise<{ data: TE }>,
  propertiesToBeRemoved: Array<keyof TE> = []
): AppEpic {
  return createDefaultApiEpic(apiActionCreator, (openGtdApi, action) => {
    const id = action.payload._id
    const body = { ...(action.payload as TE) }
    propertiesToBeRemoved.concat(['_id']).forEach(prop => delete body[prop])
    return apiMethodSelector(openGtdApi)({ body, params: { id } })
  })
}

export function createDefaultDeleteEntityApiEpic<OUT>(
  apiActionCreator: ApiActionCreator<AC<AppPayloadAction<EntityId>>, OUT>,
  apiMethodSelector: (
    openGtdApi: OpenGtdApiConsumer
  ) => (params: { params: { id: EntityId } }) => Promise<{ data: OUT }>
): AppEpic {
  return createDefaultApiEpic(apiActionCreator, (openGtdApi, action) =>
    apiMethodSelector(openGtdApi)({ params: { id: action.payload } })
  )
}
