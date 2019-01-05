import { EntityId, TaskEntity } from '@open-gtd/api'
import { Alert, Button, Checkbox, Input } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import { connect } from 'react-redux'
import { DispatchProps, mapDispatchToProps } from '../../../store'
import { taskActions } from '../../../store/actions'
import arrowImage from './task-details-arrow.png'

const { TextArea } = Input
interface TaskFormProps extends DispatchProps {
  selected: TaskEntity | EntityId[]
  clearSelection(): void
}

interface TaskDetailsState {
  notes: string
}

class TaskDetails extends React.Component<TaskFormProps, TaskDetailsState> {
  public state: TaskDetailsState = {
    notes:
      Array.isArray(this.props.selected) || this.props.selected.notes === null
        ? ''
        : this.props.selected.notes
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

  private getSelectedTask = () => {
    const { selected } = this.props
    if (Array.isArray(selected)) {
      throw new Error('More than one task is selected!')
    }
    return selected
  }

  private renderTaskProperties(task: TaskEntity) {
    return (
      <div>
        <h2>Properties</h2>
        <p>
          <Checkbox
            defaultChecked={task.isFolder}
            onChange={this.onIsFolderChange}
          >
            Folder
          </Checkbox>
        </p>
        <p>
          <Checkbox
            defaultChecked={task.isProject}
            onChange={this.onIsProjectChange}
          >
            Project
          </Checkbox>
        </p>
        <p>
          <Checkbox
            defaultChecked={task.isNeverActive}
            onChange={this.onIsNeverActiveChange}
          >
            Hide in TODO list
          </Checkbox>
        </p>
        <p>
          Notes
          <TextArea
            value={this.state.notes}
            placeholder="Add some details!"
            autosize={{ minRows: 4, maxRows: 8 }}
            onChange={this.onNotesChange}
            onBlur={this.onNotesBlur}
          />
        </p>
      </div>
    )
  }

  private onIsFolderChange = (e: CheckboxChangeEvent) => {
    this.props.dispatch(
      taskActions.updateTask.request({
        ...this.getSelectedTask(),
        isFolder: e.target.checked
      })
    )
  }

  private onIsProjectChange = (e: CheckboxChangeEvent) => {
    this.props.dispatch(
      taskActions.updateTask.request({
        ...this.getSelectedTask(),
        isProject: e.target.checked
      })
    )
  }

  private onIsNeverActiveChange = (e: CheckboxChangeEvent) => {
    this.props.dispatch(
      taskActions.updateTask.request({
        ...this.getSelectedTask(),
        isNeverActive: e.target.checked
      })
    )
  }

  private onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      notes: e.target.value
    })
  }

  private onNotesBlur = () => {
    const selectedTask = this.getSelectedTask()
    const value = this.state.notes.trim()
    const newNotes = value === '' ? null : value
    if (newNotes !== selectedTask.notes) {
      this.props.dispatch(
        taskActions.updateTask.request({ ...selectedTask, notes: newNotes })
      )
    }
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

export default connect(mapDispatchToProps)(TaskDetails)
