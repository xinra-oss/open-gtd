import { Credentials } from '@open-gtd/api'
import { Button, Form, Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import React from 'react'
import { connect } from 'react-redux'
import { DispatchProps, mapDispatchToProps } from '../store'
import { userActions } from '../store/actions'

interface RegistrationProps extends DispatchProps, FormComponentProps {}

interface RegistrationState {
  readonly showPassword: boolean
}

const FormItem = Form.Item

class RegisterForm extends React.Component<
  RegistrationProps,
  RegistrationState
> {
  public constructor(props: RegistrationProps) {
    super(props)
    this.state = {
      showPassword: false
    }
  }

  public toggleShowPassword = () =>
    this.setState({
      showPassword: !this.state.showPassword
    })

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(
          userActions.createUser.request(values as Credentials)
        )
      }
    })
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    const { showPassword } = this.state

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
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
            rules: [
              {
                required: true,
                message: 'Please input password!'
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type={showPassword ? 'input' : 'password'}
              placeholder="Password"
              suffix={
                <Icon
                  type={showPassword ? 'eye-invisible' : 'eye'}
                  onClick={this.toggleShowPassword}
                />
              }
            />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form>
    )
  }
}

export default connect(mapDispatchToProps)(Form.create()(RegisterForm))
