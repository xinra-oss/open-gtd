import * as React from 'react'
import './App.scss'

import { Checkbox, Col, Form, Input, Row } from 'antd'
import 'antd/dist/antd.css'
import { FormComponentProps } from 'antd/lib/form/Form'
import { connect } from 'react-redux'

import { DispatchProps, mapDispatchToProps } from './store'

const FormItem = Form.Item

const { TextArea } = Input
interface TaskFormProps extends FormComponentProps, DispatchProps {}

export class TaskDetails extends React.Component<TaskFormProps> {
  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // tslint:disable-next-line
        console.log(`Input Received`)
      }
    })
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="task-details">
        <FormItem>
          {getFieldDecorator('checkbox-group', {
            initialValue: ['A']
          })(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <Checkbox value="A">Folder</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox disabled value="B">
                    Never Active
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="C">Project</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
        </FormItem>
        <FormItem>
          <TextArea
            placeholder="Notes!"
            autosize={{ minRows: 2, maxRows: 6 }}
          />
        </FormItem>
      </Form>
    )
  }
}

export default connect(mapDispatchToProps)(Form.create()(TaskDetails))
