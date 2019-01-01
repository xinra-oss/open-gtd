import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.scss'
import registerServiceWorker from './registerServiceWorker'
import {
  antDesignFeedback,
  handleOpenGtdApiError,
  openGtdApi,
  Services
} from './services'
import { WebsocketSync } from './services/sync.service'
import { createAppStore } from './store'
import { sessionActions } from './store/actions'

const services: Services = {
  openGtdApi,
  handleOpenGtdApiError,
  feedback: antDesignFeedback,
  sync: new WebsocketSync('ws://localhost:3001/sync')
}

const history = createBrowserHistory()

const store = createAppStore(services, history)

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root') as HTMLElement)
registerServiceWorker()

store.dispatch(sessionActions.getSession.request())
