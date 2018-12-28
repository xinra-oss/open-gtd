import { Button, Form, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import React from 'react'
import { RouteComponentProps } from 'react-router'

interface RegistrationRouterParams {
  id: string
}

interface RegisterFormState {
  email: string
  password: string
}

interface RegistrationProps
  extends RouteComponentProps<RegistrationRouterParams> {
  form: WrappedFormUtils
}

interface RegistrationDispatchProps
  extends RegistrationProps,
    RouteComponentProps<RegistrationRouterParams> {}

const FormItem = Form.Item

class RegisterForm extends React.Component<
  RegistrationProps & RegistrationDispatchProps,
  RegisterFormState
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

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    }

    return (
      <div>
        <FormItem {...formItemLayout} label="E-mail">
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
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input password!'
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <Button>Cancel</Button> <Button type="primary">Save</Button>
      </div>
    )
  }
}
const WrappedNormalRegisterForm = Form.create<RegisterFormState>()(RegisterForm)
export default WrappedNormalRegisterForm
