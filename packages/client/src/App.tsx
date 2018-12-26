import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Home } from './components/Home'
import RegisterForm from './components/RegisterForm'

import { Layout } from 'antd'
import './App.scss'
import LoginPage from './LoginPage'

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div>
          <Layout>
            <Switch>
              <Route path="/registration" component={RegisterForm} />
              <Route path="/login" component={LoginPage} />
              <Route path="/" exact component={Home} />
            </Switch>
          </Layout>
        </div>
      </div>
    )
  }
}

export default App
