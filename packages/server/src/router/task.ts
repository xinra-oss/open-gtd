import { TaskApi } from '@open-gtd/api'
import { RouterDefinition } from 'rest-ts-express'

export const TaskRouter: RouterDefinition<typeof TaskApi> = {
  createTask: async req => {
    const task = req.body
    // TODO
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
