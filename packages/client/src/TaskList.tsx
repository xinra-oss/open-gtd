import { Task } from '@open-gtd/api'
import { Table } from 'antd'

import * as React from 'react'

const { Column } = Table

const tasks: Task[] = [
  {
    _id: '12345',
    title: 'Make poster',
    contextIds: [],
    isDone: false,
    isFolder: false,
    isNeverActive: false,
    isProject: false,
    userId: '12345'
  },
  {
    _id: '11111',
    title: 'Pay Grocery Bills',
    contextIds: [],
    isDone: false,
    isFolder: false,
    isNeverActive: false,
    isProject: false,
    userId: '11111'
  },
  {
    _id: '12222',
    title: 'Learn React',
    contextIds: [],
    isDone: false,
    isFolder: false,
    isNeverActive: false,
    isProject: false,
    userId: '12222'
  }
]

export class TaskList extends React.Component<any, any> {
  public render() {
    return (
      <Table dataSource={tasks}>
        <Column title="Task Name" dataIndex="title" key="title" />
        <Column title="is Folder" dataIndex="isFolder" key="_id" />

        <Column title="is Done" dataIndex="isDone" key="isDone" />

        <Column title="is Project" dataIndex="isProject" key="isProject" />
      </Table>
    )
  }
}
