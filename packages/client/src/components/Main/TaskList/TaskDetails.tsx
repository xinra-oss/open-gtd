import { EntityId, TaskEntity } from '@open-gtd/api'
import { Alert, Button, Checkbox, Col, Form, Input, Row } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as React from 'react'
import { connect } from 'react-redux'
import { DispatchProps, mapDispatchToProps } from '../../../store'
import arrowImage from './task-details-arrow.png'

const FormItem = Form.Item

const { TextArea } = Input
interface TaskFormProps extends FormComponentProps, DispatchProps {
  selected: TaskEntity | EntityId[]
  clearSelection(): void
}

class TaskDetails extends React.Component<TaskFormProps> {
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
    const { selected } = this.props
    if (Array.isArray(selected)) {
      return selected.length > 0
        ? this.renderMultiSelectActions(selected)
        : this.renderEmptySelectionHint()
    } else {
      return this.renderTaskProperties(selected)
    }
  }

  private renderTaskProperties(task: TaskEntity) {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <h2>Properties</h2>
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
                </Row>
                <Row>
                  <Col span={8}>
                    <Checkbox disabled value="B">
                      Never Active
                    </Checkbox>
                  </Col>
                </Row>
                <Row>
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
      </div>
    )
  }

  private renderMultiSelectActions(selectedTaskIds: EntityId[]) {
    return (
      <div>
        <h2>{selectedTaskIds.length} Tasks selected</h2>
        <p>
          <Button type="danger" block icon="delete">
            Delete
          </Button>
        </p>
        <p>
          <Button onClick={this.props.clearSelection} type="dashed" block>
            Clear selection
          </Button>
        </p>
      </div>
    )
  }

  private renderEmptySelectionHint() {
    return (
      <div>
        <Alert
          message="Select one or more tasks to see additional details."
          type="info"
          showIcon
        />
        <img style={{ margin: 10 }} src={arrowImage} />
      </div>
    )
  }
}

export default connect(mapDispatchToProps)(Form.create()(TaskDetails))
