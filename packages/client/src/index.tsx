import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.scss'
import registerServiceWorker from './registerServiceWorker'
import { handleOpenGtdApiError, openGtdApi, Services } from './services'
import { createAppStore } from './store'
import { userActions } from './store/actions'

const services: Services = {
  openGtdApi,
  handleOpenGtdApiError
}

const store = createAppStore(services)

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root') as HTMLElement)
registerServiceWorker()

store.dispatch(
  userActions.createUser.request({
    email: 'test@test.de',
    password: '12345678'
  })
)
