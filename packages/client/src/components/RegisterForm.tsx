import { Credentials } from '@open-gtd/api'
import { Button, Form, Icon, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { DispatchProps, mapDispatchToProps } from '../store'
import { userActions } from '../store/actions'

interface RegistrationRouterParams {
  id: string
}

interface RegistrationProps
  extends RouteComponentProps<RegistrationRouterParams>,
    DispatchProps {
  form: WrappedFormUtils
}

interface RegistrationState {
  readonly type: string
}

const FormItem = Form.Item

class RegisterForm extends React.Component<
  RegistrationProps,
  RegistrationState
> {
  public readonly state: RegistrationState = {
    type: 'input'
  }

  public showHide(e: any) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })
  }

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
    this.showHide = this.showHide.bind(this)

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
              type={this.state.type}
              placeholder="Password"
              suffix={
                <Icon
                  type={this.state.type === 'input' ? 'eye-invisible' : 'eye'}
                  onClick={this.showHide}
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
