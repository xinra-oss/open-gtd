import { defineAPI, DELETE, POST } from 'rest-ts-core'
import { Credentials } from './model'

export const AuthApi = defineAPI({
  createSession: POST `/session` // prettier-ignore
    .body(Credentials),
  deleteSession: DELETE `/session` // prettier-ignore
  // TODO: getCsrfToken
})
