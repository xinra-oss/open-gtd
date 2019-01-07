import { Credentials } from '@open-gtd/api'
import { Button, Form, Icon, Input } from 'antd'
import 'antd/dist/antd.css'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './App.scss'
import { DispatchProps, mapDispatchToProps } from './store'
import { sessionActions } from './store/actions'

const FormItem = Form.Item

interface LoginFormProps extends FormComponentProps, DispatchProps {}

export class LoginForm extends React.Component<LoginFormProps> {
  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(
          sessionActions.createSession.request(values as Credentials)
        )
      }
    })
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: 'Please input your email address!' }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </FormItem>
        <FormItem>
          Or <Link to="/register">register now!</Link>
        </FormItem>
      </Form>
    )
  }
}

export default connect(mapDispatchToProps)(Form.create()(LoginForm))
