import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import Main from './components/Main'
import RegisterForm from './components/RegisterForm'

import { Spin } from 'antd'
import { connect } from 'react-redux'
import './App.scss'
import LoginPage from './LoginPage'
import { AppState } from './store'

interface AppProps {
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
        <Route path="/" exact component={Main} />
      </Switch>
    )
  }
}

export default connect(({ loading }: AppState) => ({
  loading
}))(App)
