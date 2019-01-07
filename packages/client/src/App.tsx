import * as React from 'react'
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom'

import Main from './components/Main/Main'
import RegisterForm from './components/RegisterForm'

import { Spin } from 'antd'
import { connect } from 'react-redux'
import './App.scss'
import LoginPage from './LoginPage'
import { AppState } from './store'

interface AppProps extends RouteComponentProps<{}> {
  loading: boolean
}

class App extends React.Component<AppProps> {
  public render() {
    return (
      <div className="App">
        {this.props.loading ? (
          <Spin className="App-loading" size="large" />
        ) : (
          this.renderContent()
        )}
      </div>
    )
  }

  private renderContent() {
    return (
      <Switch>
        <Route path="/register" component={RegisterForm} />
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={Main} />
      </Switch>
    )
  }
}

export default withRouter(
  connect(({ loading }: AppState) => ({
    loading
  }))(App)
)
