import { TaskApi } from '@open-gtd/api'
import { Task } from 'packages/model/lib'
import { RouterDefinition } from 'rest-ts-express'

export const TaskRouter: RouterDefinition<typeof TaskApi> = {
  createTask: async req => {
    const newTask = req.body
    const task: Task = {
      ...newTask,
      userId: 'TODO'
    }
    // TODO: check if parent exists, if is stated (undefined or existing)
    // TODO: check if user exists
    return task
  },
  deleteTask: async req => {
    // const id = req.params.id
    // TODO
  },
  updateTask: async req => {
    const task = req.body
    // TODO
    return task
  }
}
