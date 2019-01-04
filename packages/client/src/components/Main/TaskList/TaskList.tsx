import { EntityId, TaskEntity } from '@open-gtd/api'
import { Button, Checkbox, Table } from 'antd'

import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { ColumnProps } from 'antd/lib/table'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dictionary } from 'ts-essentials'
import { AppState, DispatchProps, mapDispatchToProps } from '../../../store'

function onChange(e: CheckboxChangeEvent) {
  // tslint:disable-next-line
  console.log(`checked = ${e.target.checked}`)
}
const columns: Array<ColumnProps<TaskEntity>> = [
  {
    title: 'Task Name',
    dataIndex: 'title',
    render: text => text
  },
  {
    title: 'Status',
    dataIndex: 'isDone',
    render: (text, record) => (
      <span>
        <Checkbox onChange={onChange}>Done</Checkbox>
      </span>
    )
  }
]

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
        <Table columns={columns} dataSource={rootTasks} />
      </div>
    )
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
