import { EntityId, Task, TaskEntity } from '@open-gtd/api'
import { Button, Checkbox, Col, Icon, Row, Select, Tag, Tooltip } from 'antd'
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

/** pixels */
const CHILD_ROWS_INDENT = 15

interface TaskListProps extends DispatchProps {
  allTasks: TaskState
  allContexts: ContextState
  filter?: (taskRow: TaskListTaskRow) => boolean
  hierarchical?: boolean
  rootTaskId?: EntityId
  categories?: (taskRows: TaskListTaskRow[]) => TaskListCategory[]
}

interface TaskListState {
  selectedTaskIds: EntityId[]
}

export interface TaskListCategory {
  key: string
  title: string
  children?: TaskListTaskRow[]
}

interface TaskListRowType<T extends string, P> {
  type: T
  wrapped: P
  key: string
  title: string
  children?: TaskListTaskRow[]
  isDone?: boolean
  contextIds: EntityId[]
  isActive: boolean
  hierarchyLevel: number
}

export type TaskListTaskRow = TaskListRowType<'task', TaskEntity>
type TaskListCategoryRow = TaskListRowType<'category', void>

type TaskListRow = TaskListTaskRow | TaskListCategoryRow

class TaskList extends React.Component<TaskListProps, TaskListState> {
  public readonly state: TaskListState = {
    selectedTaskIds: []
  }

  public render() {
    const hierarchical = !!this.props.hierarchical
    const allTaskRows: TaskListTaskRow[] = []
    const idToChildren: Dictionary<TaskListTaskRow[]> = {}

    Object.keys(this.props.allTasks).forEach(id => {
      const task = this.props.allTasks[id]
      const taskRow: TaskListTaskRow = {
        type: 'task',
        wrapped: task,
        key: task._id,
        title: task.title,
        isDone: task.isDone,
        contextIds: task.contextIds,
        isActive: false,
        hierarchyLevel: 0
      }
      allTaskRows.push(taskRow)
      if (task.parentId !== null) {
        if (idToChildren[task.parentId] === undefined) {
          idToChildren[task.parentId] = [taskRow]
        } else {
          idToChildren[task.parentId].push(taskRow)
        }
      }
    })

    allTaskRows.forEach(row => (row.children = idToChildren[row.key]))
    let taskRowTree = allTaskRows.filter(row => row.wrapped.parentId === null)
    this.determineActiveTasks(taskRowTree)

    if (this.props.rootTaskId) {
      taskRowTree = allTaskRows.filter(
        row => row.wrapped.parentId === this.props.rootTaskId
      )
    }

    let displayedTaskRows = hierarchical
      ? taskRowTree
      : this.flattenRowTree(taskRowTree)
    displayedTaskRows = this.applyFilter(displayedTaskRows)

    const displayedRows = this.props.categories
      ? this.props.categories(displayedTaskRows).map(category => {
          const row: TaskListCategoryRow = {
            ...category,
            type: 'category',
            contextIds: [],
            isActive: false,
            hierarchyLevel: 0,
            wrapped: undefined as void
          }
          return row
        })
      : displayedTaskRows

    this.determineHierarchyLevels(displayedRows)

    const { selectedTaskIds } = this.state
    const selected =
      selectedTaskIds.length === 1
        ? this.props.allTasks[selectedTaskIds[0]]
        : selectedTaskIds

    return (
      <div className="TaskList">
        <OutsideClickHandler onOutsideClick={this.clearSelection}>
          {this.renderToolbar()}
          <Row gutter={16} style={{ height: 'calc(100% - 18px)' }}>
            <Col span={18} style={{ height: '100%' }}>
              <EditableTable
                columns={this.createColumns()}
                dataSource={displayedRows}
                handleSave={this.handleSave}
                onRow={this.onRow}
                rowClassName={this.rowClassName}
                defaultExpandAllRows
                pagination={false}
                style={{
                  height: '100%',
                  overflow: 'auto'
                }}
                indentSize={CHILD_ROWS_INDENT}
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

  private flattenRowTree(rowTree: TaskListTaskRow[]) {
    const flattened: TaskListTaskRow[] = []
    for (const row of rowTree) {
      flattened.push({ ...row, children: undefined })
      if (row.children) {
        this.flattenRowTree(row.children).forEach(c => flattened.push(c))
      }
    }
    return flattened
  }

  /**
   * A task is active if all following conditions are met
   * * start date in the past or no start date
   * * not marked as 'never active'
   * * not done
   * * doesn't have children that are active or have a start date
   * @param rows the root of the rows (sub)tree
   */
  private determineActiveTasks(rows: TaskListTaskRow[]) {
    for (const row of rows) {
      let hasCurrentOrFutureActiveChildren = false
      if (row.children) {
        this.determineActiveTasks(row.children)
        hasCurrentOrFutureActiveChildren = row.children.some(
          child => child.isActive || child.wrapped.startDate !== null
        )
      }
      const task = row.wrapped
      row.isActive =
        !hasCurrentOrFutureActiveChildren &&
        task.startDate === null && // TODO: start date in the past
        !task.isNeverActive &&
        !task.isDone
    }
  }

  private applyFilter(rows: TaskListTaskRow[]) {
    if (!this.props.filter) {
      return rows
    }
    const filterdRows: TaskListTaskRow[] = []
    for (const row of rows) {
      if (this.props.filter(row)) {
        const filteredRow = { ...row }
        if (filteredRow.children) {
          filteredRow.children = this.applyFilter(filteredRow.children)
        }
        filterdRows.push(filteredRow)
      }
    }
    return filterdRows
  }

  private determineHierarchyLevels(
    rows: TaskListRow[],
    currentLevel: number = 0
  ) {
    for (const row of rows) {
      row.hierarchyLevel = currentLevel
      if (row.children) {
        this.determineHierarchyLevels(row.children, currentLevel + 1)
      }
    }
  }

  private createColumns(): Array<EditableColumnProps<TaskListRow>> {
    return [
      {
        key: 'col1',
        width: 10,
        className: 'TaskList-col1',
        render: (text, row) =>
          row.type === 'task' ? (
            row.wrapped.isFolder ? (
              <Icon
                type="folder"
                theme="filled"
                style={{ fontSize: 20, position: 'relative', top: 2 }}
              />
            ) : (
              <span onClick={stopEventPropagation}>
                <Checkbox
                  defaultChecked={row.isDone}
                  onChange={(
                    e /* tslint:disable-next-line */ // need to bind `row`
                  ) => this.handleSave(row, { isDone: e.target.checked })}
                />
              </span>
            )
          ) : null
      },
      {
        title: 'Title',
        dataIndex: 'title',
        render: (text, row) => (
          <span style={{ paddingLeft: row.hierarchyLevel * CHILD_ROWS_INDENT }}>
            {text}
          </span>
        ),
        className: 'TaskList-title',
        editable: (row: TaskListRow) => (row.type === 'task' ? 'text' : false),
        required: true,
        width: 400
      },
      {
        title: 'Contexts',
        dataIndex: 'contextIds',
        render: this.renderContexts,
        editable: (row: TaskListRow) =>
          row.type === 'task' ? 'select' : false,
        width: 300,
        inputProps: this.getContextSelectProps,
        mapValue: (contextIds: EntityId[]) =>
          contextIds.map(id => ({
            key: id,
            label: this.props.allContexts[id].name
          }))
      },
      {
        key: 'actions',
        render: this.renderTaskActionButtons,
        width: 200
      }
    ]
  }

  private clearSelection = () => this.setState({ selectedTaskIds: [] })

  private deleteTask = (taskId: EntityId) => {
    const selectedTaskIds = [...this.state.selectedTaskIds]
    const index = selectedTaskIds.indexOf(taskId)
    if (index > -1) {
      selectedTaskIds.splice(index, 1)
    }
    this.setState({ selectedTaskIds }, () =>
      this.props.dispatch(taskActions.deleteTask.request(taskId))
    )
  }

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
        : this.clearSelection
  })

  private rowClassName = (row: TaskListRow) => {
    let classes = 'TaskList-row'
    if (row.type === 'category') {
      classes = ' row-category'
    }
    if (row.type === 'task') {
      if (this.state.selectedTaskIds.indexOf(row.wrapped._id) > -1) {
        classes += ' row-selected'
      }
      if (row.wrapped.isDone) {
        classes += ' row-done'
      }
      if (row.wrapped.isProject) {
        classes += ' row-project'
      }
      if (row.wrapped.isNeverActive) {
        classes += ' row-never-active'
      }
      if (row.isActive) {
        classes += ' row-active'
      }
    }
    return classes
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
        this.props.allTasks[this.state.selectedTaskIds[0]].parentId
      )
    } else {
      this.createNewTask(this.props.rootTaskId || null)
    }
  }

  private handleSubTask = () => {
    this.createNewTask(this.state.selectedTaskIds[0])
  }

  private createNewTask = (parentID: string | null) => {
    const newTask: Task = {
      contextIds: [],
      dueDate: null,
      isDone: false,
      isFolder: false,
      isNeverActive: false,
      isProject: false,
      notes: null,
      parentId: parentID,
      startDate: null,
      title: 'New task'
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
            <Tag key={context._id} color={task.isDone ? undefined : 'blue'}>
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

  private renderTaskActionButtons = (text: string, row: TaskListRow) => {
    if (row.type !== 'task') {
      return null
    }
    return (
      <span className="TaskList-actions">
        <Button
          type="danger"
          icon="delete" /* tslint:disable-next-line */
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            this.deleteTask(row.wrapped._id)
          }}
        >
          Delete
        </Button>
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
