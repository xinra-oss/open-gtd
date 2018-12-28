import { Task } from '@open-gtd/api'
import { Table } from 'antd'

import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import * as React from 'react'

const columns: Array<ColumnProps<Task>> = [
  {
    title: 'Task Name',
    dataIndex: 'taskname',
    render: text => <a href="#">{text}</a>
  },
  {
    title: 'is Done',
    dataIndex: 'isdone'
  },
  {
    title: 'is Folder',
    dataIndex: 'isfolder'
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
