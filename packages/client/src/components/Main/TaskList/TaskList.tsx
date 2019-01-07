import { EntityId, Task, TaskEntity } from '@open-gtd/api'
import { Button, Checkbox, Col, Row, Select, Tag, Tooltip } from 'antd'
import * as React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { connect } from 'react-redux'
import { Dictionary } from 'ts-essentials'
import { AppState, DispatchProps, mapDispatchToProps } from '../../../store'
import { taskActions } from '../../../store/actions'
import { ContextState, TaskState } from '../../../store/state'
import { PROTECTED_SPACE, stopEventPropagation } from '../../../util'
import EditableTable, {
  EditableColumnProps
} from '../../EditableTable/EditableTable'
import TaskDetails from './TaskDetails'
import './TaskList.scss'

interface TaskListProps extends DispatchProps {
  allTasks: TaskState
  allContexts: ContextState
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
  contextIds: EntityId[]
}

type TaskListRow =
  | TaskListRowType<'category', void>
  | TaskListRowType<'task', TaskEntity>

class TaskList extends React.Component<TaskListProps, TaskListState> {
  public readonly state: TaskListState = {
    selectedTaskIds: []
  }

  public render() {
    const hierarchical = !!this.props.hierarchical
    const filter = this.props.filter || (() => true)
    let rows: TaskListRow[] = []
    const idToChildren: Dictionary<TaskListRow[]> = {}

    Object.keys(this.props.allTasks).forEach(id => {
      const task = this.props.allTasks[id]
      const row: TaskListRow = {
        type: 'task',
        wrapped: task,
        key: task._id,
        title: task.title,
        isDone: task.isDone,
        contextIds: task.contextIds
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
        row =>
          row.type === 'task' /* always true */ && row.wrapped.parentId === null
      )
    }

    const { selectedTaskIds } = this.state
    const selected =
      selectedTaskIds.length === 1
        ? this.props.allTasks[selectedTaskIds[0]]
        : selectedTaskIds

    return (
      <div className="TaskList">
        <OutsideClickHandler onOutsideClick={this.clearSelection}>
          {this.renderToolbar()}
          <Row gutter={16}>
            <Col span={18}>
              <EditableTable
                columns={this.createColumns()}
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

  private createColumns(): Array<EditableColumnProps<TaskListRow>> {
    return [
      {
        title: 'Task Name',
        dataIndex: 'title',
        render: text => text,
        editable: 'text',
        required: true
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
      },
      {
        title: 'Contexts',
        dataIndex: 'contextIds',
        render: this.renderContexts,
        editable: 'select',
        inputProps: this.getContextSelectProps,
        mapValue: (contextIds: EntityId[]) =>
          contextIds.map(id => ({
            key: id,
            label: this.props.allContexts[id].name
          }))
      }
    ]
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
      values = { ...values }
      if (values.contextIds) {
        values.contextIds = values.contextIds.map(c => (c as any).key)
      }
      this.props.dispatch(
        taskActions.updateTask.request({ ...row.wrapped, ...values })
      )
    }
  }

  private handleNewTask = () => {
    if (this.state.selectedTaskIds.length > 0) {
      this.createNewTask(
        this.props.allTasks[this.state.selectedTaskIds[0]].parentId,
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

  private renderContexts = (text: any, row: TaskListRow) => {
    if (row.type !== 'task') {
      return null
    }
    const task = row.wrapped
    const contexts = task.contextIds.map(id => this.props.allContexts[id])
    if (contexts.length === 0) {
      return PROTECTED_SPACE
    }
    return (
      <span>
        {contexts.map(context => {
          const isTooLong = context.name.length > 20
          const tag = (
            <Tag key={context._id} color="blue">
              {isTooLong ? context.name.slice(0, 17) + '...' : context.name}
            </Tag>
          )
          return isTooLong ? (
            <Tooltip key={context._id} title={context.name}>
              {tag}
            </Tooltip>
          ) : (
            tag
          )
        })}
      </span>
    )
  }

  private getContextSelectProps = (row: TaskListRow) => {
    if (row.type !== 'task') {
      return
    }
    const { allContexts } = this.props
    const contextIdsLeft = Object.keys(allContexts).filter(
      id => row.contextIds.indexOf(id) === -1
    )
    return {
      mode: 'multiple',
      placeholder: 'Add context...',
      notFoundContent: 'No context left.',
      labelInValue: true,
      children: contextIdsLeft.map(id => {
        return <Select.Option key={id}>{allContexts[id].name}</Select.Option>
      }),
      filterOption: (
        inputValue: string,
        option: { props: { children: string } }
      ) => {
        return new RegExp(`.*${inputValue}.*`, 'i').test(option.props.children)
      }
    }
  }
}

export default connect(
  (state: AppState) => ({ allTasks: state.tasks, allContexts: state.contexts }),
  mapDispatchToProps
)(TaskList)
