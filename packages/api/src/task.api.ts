import { defineAPI, DELETE, GET, POST, PUT } from 'rest-ts-core'
import { Array } from 'runtypes'
import { EMPTY_RESPONSE, Task, TaskEntity } from './model'

export const TaskApi = defineAPI({
  createTask: POST `/tasks` // prettier-ignore
    .body(Task)
    .response(TaskEntity),
  deleteTask: DELETE `/tasks/${'id'}` // prettier-ignore
    .response(EMPTY_RESPONSE),
  getTask: GET `/tasks/${'id'}` // prettier-ignore
    .response(TaskEntity),
  getTaskList: GET `/tasks` // prettier-ignore
    .response(Array(TaskEntity)),
  updateTask: PUT `/tasks/${'id'}` // prettier-ignore
    .body(TaskEntity)
    .response(TaskEntity)
})
