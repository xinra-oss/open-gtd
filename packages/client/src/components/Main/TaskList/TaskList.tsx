import { EntityId, TaskEntity } from '@open-gtd/api'
import { Button, Checkbox } from 'antd'
import * as React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { connect } from 'react-redux'
import { Dictionary } from 'ts-essentials'
import { AppState, DispatchProps, mapDispatchToProps } from '../../../store'
import { taskActions } from '../../../store/actions'
import EditableTable, {
  EditableColumnProps
} from '../../EditableTable/EditableTable'
import './TaskList.scss'

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
              e /* tslint:disable-next-line */ // need to bind `record`
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
      <div className="TaskList">
        {this.state.selectedTaskIds.length}
        {this.renderToolbar()}
        <OutsideClickHandler onOutsideClick={this.onOutsideClick}>
          <EditableTable
            columns={this.columns}
            dataSource={rootTasks}
            handleSave={this.handleSave}
            rowKey="_id"
            onRow={this.onRow}
            rowClassName={this.rowClassName}
          />
        </OutsideClickHandler>
      </div>
    )
  }

  private onOutsideClick = () => this.setState({ selectedTaskIds: [] })

  private onRow = (row: TaskEntity) => ({
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      let { selectedTaskIds } = this.state
      if (e.ctrlKey) {
        const index = selectedTaskIds.indexOf(row._id)
        if (index > -1) {
          selectedTaskIds.splice(index, 1)
        } else {
          selectedTaskIds.push(row._id)
        }
      } else {
        selectedTaskIds = [row._id]
      }
      this.setState({
        selectedTaskIds
      })
    }
  })

  private rowClassName = (row: TaskEntity) => {
    return this.state.selectedTaskIds.indexOf(row._id) > -1
      ? 'selected-row'
      : ''
  }

  private handleSave = (task: TaskEntity) => {
    this.props.dispatch(taskActions.updateTask.request(task))
  }

  private renderToolbar() {
    const { selectedTaskIds } = this.state

    return (
      <div style={{ marginBottom: 10 }}>
        <Button.Group>
          <Button
            type="primary"
            icon="plus"
            disabled={selectedTaskIds.length > 1}
          >
            New task
          </Button>
          <Button
            type="primary"
            icon="plus-square"
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
