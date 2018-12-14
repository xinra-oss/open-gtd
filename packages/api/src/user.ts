import { defineAPI, POST } from 'rest-ts-core'
import { User } from './model'

export const UserApi = defineAPI({
  createUser: POST `/users` // prettier-ignore
    .body(User)
    .response(User)
})
