import { EntityId, Task, TaskEntity } from '@open-gtd/api'
import { Button, Checkbox, Col, Row } from 'antd'
import * as React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { connect } from 'react-redux'
import { Dictionary } from 'ts-essentials'
import { AppState, DispatchProps, mapDispatchToProps } from '../../../store'
import { taskActions } from '../../../store/actions'
import { stopEventPropagation } from '../../../util'
import EditableTable, {
  EditableColumnProps
} from '../../EditableTable/EditableTable'
import TaskDetails from './TaskDetails'
import './TaskList.scss'

interface TaskListProps extends DispatchProps {
  tasks: Dictionary<TaskEntity>
  filter?: (task: TaskEntity) => boolean
  hierarchical?: boolean
}

interface TaskListState {
  selectedTaskIds: EntityId[]
}

interface TaskListRowType<T extends string, P> {
  type: T
  wrapped: P
  key: string
  title: string
  children?: TaskListRow[]
  isDone?: boolean
}

type TaskListRow =
  | TaskListRowType<'category', void>
  | TaskListRowType<'task', TaskEntity>

class TaskList extends React.Component<TaskListProps, TaskListState> {
  public readonly state: TaskListState = {
    selectedTaskIds: []
  }

  private columns: Array<EditableColumnProps<TaskListRow>> = [
    {
      title: 'Task Name',
      dataIndex: 'title',
      render: text => text,
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'isDone',
      render: (text, row) =>
        row.type === 'task' ? (
          <span onClick={stopEventPropagation}>
            <Checkbox
              defaultChecked={row.isDone}
              onChange={(
                e /* tslint:disable-next-line */ // need to bind `row`
              ) => this.handleSave(row, { isDone: e.target.checked })}
            >
              Done
            </Checkbox>
          </span>
        ) : null
    }
  ]

  public render() {
    const hierarchical = !!this.props.hierarchical
    const filter = this.props.filter || (() => true)
    let rows: TaskListRow[] = []
    const idToChildren: Dictionary<TaskListRow[]> = {}

    Object.keys(this.props.tasks).forEach(id => {
      const task = this.props.tasks[id]
      const row: TaskListRow = {
        type: 'task',
        wrapped: task,
        key: task._id,
        title: task.title,
        isDone: task.isDone
      }
      if (filter(task)) {
        rows.push(row)
      }
      if (hierarchical && task.parentId !== null) {
        if (idToChildren[task.parentId] === undefined) {
          idToChildren[task.parentId] = [row]
        } else {
          idToChildren[task.parentId].push(row)
        }
      }
    })

    if (hierarchical) {
      rows.forEach(row => (row.children = idToChildren[row.key]))
      rows = rows.filter(
        row => row.type === 'task' && row.wrapped.parentId === null
      )
    }

    const { selectedTaskIds } = this.state
    const selected =
      selectedTaskIds.length === 1
        ? this.props.tasks[selectedTaskIds[0]]
        : selectedTaskIds

    return (
      <div className="TaskList">
        <OutsideClickHandler onOutsideClick={this.clearSelection}>
          {this.renderToolbar()}
          <Row gutter={16}>
            <Col span={18}>
              <EditableTable
                columns={this.columns}
                dataSource={rows}
                handleSave={this.handleSave}
                onRow={this.onRow}
                rowClassName={this.rowClassName}
                defaultExpandAllRows
              />
            </Col>
            <Col span={6}>
              <TaskDetails
                selected={selected}
                clearSelection={this.clearSelection}
              />
            </Col>
          </Row>
        </OutsideClickHandler>
      </div>
    )
  }

  private clearSelection = () => this.setState({ selectedTaskIds: [] })

  private onRow = (row: TaskListRow) => ({
    onClick:
      row.type === 'task'
        ? (e: React.MouseEvent<HTMLElement>) => {
            const task = row.wrapped
            let selectedTaskIds = [...this.state.selectedTaskIds]
            if (e.ctrlKey) {
              const index = selectedTaskIds.indexOf(task._id)
              if (index > -1) {
                selectedTaskIds.splice(index, 1)
              } else {
                selectedTaskIds.push(task._id)
              }
            } else {
              selectedTaskIds = [task._id]
            }
            this.setState({
              selectedTaskIds
            })
          }
        : this.clearSelection()
  })

  private rowClassName = (row: TaskListRow) => {
    return row.type === 'task' &&
      this.state.selectedTaskIds.indexOf(row.wrapped._id) > -1
      ? 'selected-row'
      : ''
  }

  private handleSave = (row: TaskListRow, values: Partial<TaskListRow>) => {
    if (row.type === 'task') {
      this.props.dispatch(
        taskActions.updateTask.request({ ...row.wrapped, ...values })
      )
    }
  }

  private handleNewTask = () => {
    if (this.state.selectedTaskIds.length > 0) {
      this.createNewTask(
        this.props.tasks[this.state.selectedTaskIds[0]].parentId,
        'New Task'
      )
    } else {
      this.createNewTask(null, 'New Root Task')
    }
  }

  private handleSubTask = () => {
    this.createNewTask(this.state.selectedTaskIds[0], 'New Sub Task')
  }

  private createNewTask = (parentID: string | null, testTitle: string) => {
    const newTask: Task = {
      contextIds: [],
      dueDate: null,
      isDone: false,
      isFolder: true,
      isNeverActive: true,
      isProject: false,
      notes: null,
      parentId: parentID,
      startDate: null,
      title: testTitle
    }
    this.props.dispatch(taskActions.createTask.request(newTask))
  }

  private renderToolbar() {
    const { selectedTaskIds } = this.state

    return (
      <div style={{ marginBottom: 10 }}>
        <Button.Group>
          <Button
            type="primary"
            icon="plus"
            onClick={this.handleNewTask}
            disabled={selectedTaskIds.length > 1}
          >
            New task
          </Button>
          <Button
            type="primary"
            icon="plus-square"
            onClick={this.handleSubTask}
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
