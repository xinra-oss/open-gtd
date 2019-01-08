import { Credentials, ValidationErrors } from '@open-gtd/api'
import { Button, Card, Form, Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import React from 'react'
import Center from 'react-center'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppState, DispatchProps, mapDispatchToProps } from '../store'
import { userActions } from '../store/actions'
import { getFormItemValidationProps } from '../util'

interface RegistrationProps extends DispatchProps, FormComponentProps {
  validationErrors: ValidationErrors<Credentials>
}

const mapStateToProps = (state: AppState) => ({
  validationErrors: state.info.validationErrors
})

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
    const { validationErrors } = this.props
    const { showPassword } = this.state

    return (
      <Center style={{ height: '100%' }}>
        <Card
          style={{ width: 300 }}
          title="Register"
          actions={[
            <Link to="/login" key="login">
              Login
            </Link>
          ]}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem
              {...getFormItemValidationProps(validationErrors, 'email')}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'Please input a valid e-mail address.'
                  },
                  {
                    required: true,
                    message: 'Please input your e-mail address.'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="E-mail"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters long.'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
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
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form>
        </Card>
      </Center>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(RegisterForm))
