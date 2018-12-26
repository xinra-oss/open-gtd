import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.scss'
import registerServiceWorker from './registerServiceWorker'
import { handleOpenGtdApiError, openGtdApi, Services } from './services'
import { createAppStore } from './store'

const services: Services = {
  openGtdApi,
  handleOpenGtdApiError
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
