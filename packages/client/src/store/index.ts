import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Services } from '../services'
import { AppAction } from './actions'
import { appEpic, createAppEpicMiddleware } from './epic'
import { appReducer } from './reducer/app.reducer'
import { AppState } from './state/app.state'

export { AppState, AppAction }

export function createAppStore(services: Services): Store<AppState, AppAction> {
  const epicMiddleware = createAppEpicMiddleware(services)
  const store = createStore(
    appReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  )
  epicMiddleware.run(appEpic)
  return store
}
