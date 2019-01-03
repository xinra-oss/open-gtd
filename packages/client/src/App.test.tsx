import { createMemoryHistory } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import App from './App'
import { antDesignInfo, openGtdApi, Services } from './services'
import { createAppStore } from './store'

const noop = () => {
  return
}

it('renders without crashing', () => {
  const div = document.createElement('div')

  const services: Services = {
    openGtdApi,
    info: antDesignInfo,
    sync: {
      setStore: noop,
      start: noop
    }
  }

  const history = createMemoryHistory()
  const store = createAppStore(services, history)

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
