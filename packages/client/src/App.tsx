import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Main } from './components/Main'
import RegisterForm from './components/RegisterForm'

import { Layout } from 'antd'
import './App.scss'
import LoginPage from './LoginPage'
import { TaskList } from './TaskList'

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div>
          <Layout>
            <Switch>
              <Route path="/register" component={RegisterForm} />
              <Route path="/login" component={LoginPage} />
              <Route path="/" exact component={Main} />
              <Route path="/tasks" component={TaskList} />
            </Switch>
          </Layout>
        </div>
      </div>
    )
  }
}

export default App
