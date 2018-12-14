import { User } from './model'
import { defineAPI, POST } from 'rest-ts-core'

export const UserApi = defineAPI({
  createUser: POST `/users` // prettier-ignore
    .body(User)
    .response(User)
})
