import { NewTask, Task } from '@open-gtd/model'
import { defineAPI, DELETE, GET, POST, PUT } from 'rest-ts-core'
import {Array} from 'runtypes'

export const TaskApi = defineAPI({
  createTask: POST `/tasks` // prettier-ignore
    .body(NewTask)
    .response(Task),
  deleteTask: DELETE `/tasks/${'id'}`, // prettier-ignore
  getTask: GET `/tasks/${'id'}` // prettier-ignore
    .response(Task),
  getTaskList: GET `/tasks` // prettier-ignore
    .response(Array(Task)),
  updateTask: PUT `/tasks/${'id'}` // prettier-ignore
    .body(Task)
    .response(Task)
})
