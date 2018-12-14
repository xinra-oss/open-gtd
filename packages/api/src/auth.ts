import { Credentials } from './model'
import { defineAPI, POST, DELETE } from 'rest-ts-core'

export const AuthApi = defineAPI({
  createSession: POST `/session` // prettier-ignore
    .body(Credentials),
  deleteSession: DELETE `/session` // prettier-ignore
  // TODO: getCsrfToken
})
