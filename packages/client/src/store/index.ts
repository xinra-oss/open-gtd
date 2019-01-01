import { routerMiddleware } from 'connected-react-router'
import { History } from 'history'
import { applyMiddleware, createStore, Dispatch, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Services } from '../services'
import { AppAction } from './actions'
import { appEpic, createAppEpicMiddleware } from './epic'
import { createAppReducer } from './reducer/app.reducer'
import { AppState } from './state/app.state'

export { AppState, AppAction }

export type AppStore = Store<AppState, AppAction>

export function createAppStore(services: Services, history: History): AppStore {
  const epicMiddleware = createAppEpicMiddleware(services)
  const store = createStore(
    createAppReducer(history),
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), epicMiddleware)
    )
  )
  services.openGtdApi.storeHolder.store = store
  services.sync.setStore(store)
  epicMiddleware.run(appEpic)
  return store
}

export interface DispatchProps {
  dispatch: Dispatch<AppAction>
}

export const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => ({
  dispatch
})
