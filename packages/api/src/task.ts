import { Task } from '@open-gtd/model'
import { defineAPI, DELETE, POST, PUT } from 'rest-ts-core'

export const TaskApi = defineAPI({
  createTask: POST `/tasks` // prettier-ignore
    .body(Task)
    .response(Task),
  deleteTask: DELETE `/tasks/${'id'}`, // prettier-ignore
  updateTask: PUT `/tasks/${'id'}` // prettier-ignore
    .body(Task)
    .response(Task)
})
