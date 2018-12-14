import { Rate } from 'antd'
import * as React from 'react'
import './App.scss'
import LoginForm from './LoginForm'

class LoginPage extends React.Component {
  public render() {
    return (
      <div>
        <h1>Login page</h1>

        <LoginForm />
      </div>
    )
  }
}

export default LoginPage
