import * as React from 'react'
import TaskList from '../TaskList/TaskList'
import { isActive } from './filters'

const ActiveTasks: React.SFC = () => {
  return <TaskList filter={isActive} />
}

export default ActiveTasks
