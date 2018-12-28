import {
  combineEpics,
  createEpicMiddleware,
  Epic,
  EpicMiddleware
} from 'redux-observable'
import { Services } from '../../services'
import { AppAction } from '../actions'
import { AppState } from '../state/app.state'
import { authEpic } from './auth.epic'
import { userEpic } from './user.epic'

export type AppEpic = Epic<AppAction, AppAction, AppState, Services>

export const appEpic = combineEpics(userEpic, authEpic)

export function createAppEpicMiddleware(
  services: Services
): EpicMiddleware<AppAction, AppAction, AppState, Services> {
  return createEpicMiddleware({ dependencies: services })
}
