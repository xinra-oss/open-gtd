import { Task } from '@open-gtd/model'
import { defineAPI, DELETE, POST, PUT } from 'rest-ts-core'

export const TaskApi = defineAPI({
  createTask: POST(`/tasks`)
    .body(Task)
    .response(Task),
  deleteTask: DELETE(`/tasks/${'id'}`),
  updateTask: PUT(`/tasks/${'id'}`)
    .body(Task)
    .response(Task)
})
