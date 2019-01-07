import { Form, Input, Select } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import React from 'react'
import { EditableContext } from './EditableContext'

const FormItem = Form.Item

export interface EditableCellState {
  editing: boolean
}

export type InputType = false | 'text' | 'select'

export interface EditableCellProps<T> {
  editable: InputType
  required: boolean
  record: T
  inputProps: (row: T) => any
  dataIndex: keyof T
  title: string
  handleSave(record: T, values: Partial<T>): void
  mapValue(value: any): any
}

export class EditableCell<T> extends React.Component<
  EditableCellProps<T>,
  EditableCellState
> {
  public state: EditableCellState = {
    editing: false
  }

  private input: any
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

  public toggleEdit = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation()
    }
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing && 'focus' in this.input) {
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
        handleSave(record, values)
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
      required,
      inputProps,
      mapValue,
      ...restProps
    } = this.props
    const getInputProps = inputProps || (() => null)
    return (
      <td
        ref={node => (this.cell = node as HTMLTableDataCellElement)}
        {...restProps}
      >
        {editable ? (
          <EditableContext.Consumer>
            {(form: WrappedFormUtils) => {
              this.form = form
              let value = record[dataIndex]
              if (mapValue !== undefined) {
                value = mapValue(value)
              }
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: required
                      ? [
                          {
                            required: true,
                            message: `${title} is required.`
                          }
                        ]
                      : [],
                    initialValue: value
                  })(
                    editable === 'select' ? (
                      <Select
                        ref={node => (this.input = node)}
                        style={{ width: '100%' }}
                        {...getInputProps(record)}
                      />
                    ) : (
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        {...getInputProps(record)}
                      />
                    )
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
