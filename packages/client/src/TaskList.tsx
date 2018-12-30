import { Task } from '@open-gtd/api'
import { Checkbox, Table } from 'antd'

import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import * as React from 'react'

function onChange(e: CheckboxChangeEvent) {
  // tslint:disable-next-line
  console.log(`checked = ${e.target.checked}`)
}
const columns: Array<ColumnProps<Task>> = [
  {
    title: 'Task Name',
    dataIndex: 'title',
    render: text => <a href="#">{text}</a>
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
const tasks: Task[] = [
  {
    title: 'Make poster',
    contextIds: [],
    isDone: false,
    isFolder: false,
    isNeverActive: false,
    isProject: false,
    dueDate: null,
    notes: null,
    parentId: null,
    startDate: null
  },
  {
    title: 'Pay Grocery Bills',
    contextIds: [],
    isDone: false,
    isFolder: false,
    isNeverActive: false,
    isProject: false,
    dueDate: null,
    notes: null,
    parentId: null,
    startDate: null
  },
  {
    title: 'Learn React',
    contextIds: [],
    isDone: false,
    isFolder: false,
    isNeverActive: false,
    isProject: false,
    dueDate: null,
    notes: null,
    parentId: null,
    startDate: null
  }
]
const rowSelection: TableRowSelection<Task> = {
  onChange: (selectedRowKeys, selectedRows) => {
    // tslint:disable-next-line
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
  },
  getCheckboxProps: record => ({
    name: record.title
  })
}

export class TaskList extends React.Component<any, any> {
  public render() {
    return (
      <Table rowSelection={rowSelection} columns={columns} dataSource={tasks} />
    )
  }
}
