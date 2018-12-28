import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { AppEpic } from '.'
import { OpenGtdApiConsumer } from '../../services/api.service'
import { AC } from '../action-creator'
import { AppAction, AppPayloadAction } from '../actions'

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

export function createDefaultApiEpicWithPayloadAsBody<IN, OUT>(
  apiActionCreator: ApiActionCreator<AC<AppPayloadAction<IN>>, OUT>,
  apiMethodSelector: (
    openGtdApi: OpenGtdApiConsumer
  ) => (params: { body: IN }) => Promise<{ data: OUT }>
): AppEpic {
  return createDefaultApiEpic(apiActionCreator, (openGtdApi, action) =>
    apiMethodSelector(openGtdApi)({ body: action.payload })
  )
}
