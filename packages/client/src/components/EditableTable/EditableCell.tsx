import { Form, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import React from 'react'
import { EditableContext } from './EditableContext'

const FormItem = Form.Item

export interface EditableCellState {
  editing: boolean
}

export interface EditableCellProps<T> {
  editable: boolean
  record: T
  dataIndex: keyof T
  title: string
  handleSave(record: T): void
}

export class EditableCell<T> extends React.Component<
  EditableCellProps<T>,
  EditableCellState
> {
  public state: EditableCellState = {
    editing: false
  }

  private input: Input = {} as Input
  private cell: HTMLTableDataCellElement = {} as HTMLTableDataCellElement
  private form: WrappedFormUtils = {} as WrappedFormUtils

  public componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  public componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  public toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  public handleClickOutside = (e: any) => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save()
    }
  }

  public save = () => {
    const { record, handleSave, dataIndex } = this.props
    this.form.validateFields((error, values) => {
      if (error) {
        return
      }
      this.toggleEdit()
      if (record[dataIndex] !== values[dataIndex]) {
        handleSave({ ...record, ...values })
      }
    })
  }

  public render() {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      title,
      record,
      handleSave,
      ...restProps
    } = this.props
    return (
      <td
        ref={node => (this.cell = node as HTMLTableDataCellElement)}
        {...restProps}
      >
        {editable ? (
          <EditableContext.Consumer>
            {(form: WrappedFormUtils) => {
              this.form = form
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(
                    <Input
                      ref={node => (this.input = node as Input)}
                      onPressEnter={this.save}
                    />
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              )
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    )
  }
}
