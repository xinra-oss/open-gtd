import { Credentials } from '@open-gtd/api'
import { Button, Form, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import {
  DispatchProps,
  mapDispatchToProps,
  mapStateToEmptyProps
} from '../store'
import { userActions } from '../store/actions'

interface RegistrationRouterParams {
  id: string
}

interface RegistrationProps
  extends RouteComponentProps<RegistrationRouterParams>,
    DispatchProps {
  form: WrappedFormUtils
}

const FormItem = Form.Item

class RegisterForm extends React.Component<RegistrationProps> {
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
      <Form onSubmit={this.handleSubmit}>
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
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form>
    )
  }
}

export default connect(
  mapStateToEmptyProps,
  mapDispatchToProps
)(Form.create()(RegisterForm))
