import * as React from 'react'
import './App.scss'

import { Button, Form, Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'

const FormItem = Form.Item
interface LoginFormState {
  email: string
  password: string
}

// interface NormalLoginProps {}

export class LoginForm extends React.Component<
  FormComponentProps,
  LoginFormState
> {
  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // tslint:disable-next-line
        console.log('Received values of form: ', values)
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
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    )
  }
}

const WrappedNormalLoginForm = Form.create<LoginFormState>()(LoginForm)
export default WrappedNormalLoginForm
