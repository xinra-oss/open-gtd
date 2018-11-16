import { Task } from '@open-gtd/model'
import { ApiDefinition, DELETE, POST, PUT } from 'rest-ts-core'

export const TaskApi: ApiDefinition = {
  createTask: POST(`/tasks`)
    .body(Task)
    .response(Task),
  deleteTask: DELETE(`/tasks/${'id'}`),
  updateTask: PUT(`/tasks/${'id'}`)
    .body(Task)
    .response(Task)
}
