import { Spin } from 'antd'
import * as React from 'react'
import Center from 'react-center'
import { connect } from 'react-redux'
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom'
import './App.scss'
import Main from './components/Main/Main'
import RegisterForm from './components/RegisterForm'
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
          <Center>
            <Spin className="App-loading" size="large" />
          </Center>
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
