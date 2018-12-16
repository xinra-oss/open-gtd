import * as React from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import { Registration } from './components/Registration'
import { Home } from './components/Home'
import { history } from './history'

import './App.scss'
import { Layout } from 'antd';

class App extends React.Component {
  public render() {
    return (
      <Router history={history}>
        <div className="App">
          <div>
          <Layout>
            <Switch>
              <Route path="/registration" component={Registration} />
              <Route path="/" exact component={Home} /> 
            </Switch>
          </Layout>
          </div>
        </div>
      </Router>
      
    )
  }
}

export default App
