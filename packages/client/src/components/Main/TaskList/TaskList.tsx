import { EntityId, TaskEntity } from '@open-gtd/api'
import { Button, Checkbox } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dictionary } from 'ts-essentials'
import { AppState, DispatchProps, mapDispatchToProps } from '../../../store'
import { taskActions } from '../../../store/actions'
import EditableTable, {
  EditableColumnProps
} from '../../EditableTable/EditableTable'

interface TaskListProps extends DispatchProps {
  tasks: Dictionary<TaskEntity>
  filter?: (task: TaskEntity) => boolean
}

interface TaskListState {
  selectedTaskIds: EntityId[]
}

class TaskList extends React.Component<TaskListProps, TaskListState> {
  public readonly state: TaskListState = {
    selectedTaskIds: []
  }

  private columns: Array<EditableColumnProps<TaskEntity>> = [
    {
      title: 'Task Name',
      dataIndex: 'title',
      render: text => text,
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'isDone',
      render: (text, record) => (
        <span>
          <Checkbox
            data-task={record}
            onChange={(
              e // tslint:disable-next-line
            ) => this.handleSave({ ...record, isDone: e.target.checked })}
          >
            Done
          </Checkbox>
        </span>
      )
    }
  ]

  public render() {
    const filter = this.props.filter || (() => true)
    const rootTasks: TaskEntity[] = []

    Object.keys(this.props.tasks).forEach(id => {
      const task = this.props.tasks[id]
      if (filter(task)) {
        rootTasks.push(task)
      }
    })

    return (
      <div>
        {this.renderToolbar()}
        <EditableTable
          columns={this.columns}
          dataSource={rootTasks}
          handleSave={this.handleSave}
          rowKey="_id"
        />
      </div>
    )
  }

  private handleSave = (task: TaskEntity) => {
    this.props.dispatch(taskActions.updateTask.request(task))
  }

  private renderToolbar() {
    const { selectedTaskIds } = this.state

    return (
      <div style={{ marginBottom: 10 }}>
        <Button.Group>
          <Button type="primary" icon="plus-square">
            New task
          </Button>
          <Button
            type="primary"
            icon="plus"
            disabled={selectedTaskIds.length !== 1}
          >
            New subtask
          </Button>
        </Button.Group>
      </div>
    )
  }
}

export default connect(
  ({ tasks }: AppState) => ({ tasks }),
  mapDispatchToProps
)(TaskList)
