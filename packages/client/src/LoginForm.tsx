import { Credentials } from '@open-gtd/api'
import { Button, Card, Form, Icon, Input } from 'antd'
import 'antd/dist/antd.css'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as React from 'react'
import Center from 'react-center'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './App.scss'
import { DispatchProps, mapDispatchToProps } from './store'
import { sessionActions } from './store/actions'

const FormItem = Form.Item

interface LoginFormProps extends FormComponentProps, DispatchProps {}

class LoginForm extends React.Component<LoginFormProps> {
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
      <Center style={{ height: '100%' }}>
        <Card
          style={{ width: 300 }}
          title="Login"
          actions={[
            <Link to="/login" key="forgotpw">
              Forgot password
            </Link>,
            <Link to="/register" key="register">
              Register
            </Link>
          ]}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your email address!'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form>
        </Card>
      </Center>
    )
  }
}

export default connect(mapDispatchToProps)(Form.create()(LoginForm))
