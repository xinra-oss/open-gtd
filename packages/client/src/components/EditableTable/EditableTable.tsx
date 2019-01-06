import Table, { ColumnProps, TableProps } from 'antd/lib/table'
import React from 'react'
import { EditableCell } from './EditableCell'
import { EditableFormRow } from './EditableFormRow'
import './EditableTable.scss'

export type EditableColumnProps<T> = ColumnProps<T> & { editable?: boolean }

export interface EditableTableProps<T> extends TableProps<T> {
  columns: Array<EditableColumnProps<T>>
  handleSave: (record: T, values: Partial<T>) => void
}

class EditableTable<T> extends React.Component<EditableTableProps<T>> {
  public render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }

    const { columns, handleSave, className, ...restProps } = this.props

    const editableColumns = columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record: T) => {
          return {
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave
          }
        }
      }
    })

    return (
      <Table
        {...restProps}
        className={(className || '') + ' EditableTable'}
        rowClassName={this.rowClassName}
        components={components}
        columns={editableColumns}
      />
    )
  }

  private rowClassName = (record: T, index: number) => {
    let className = 'editable-row'
    if (this.props.rowClassName) {
      className += ' ' + this.props.rowClassName(record, index)
    }
    return className
  }
}

export default EditableTable
