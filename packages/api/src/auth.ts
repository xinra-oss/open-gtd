import { defineAPI, DELETE, POST } from 'rest-ts-core'
import { Void } from 'runtypes'
import { Credentials } from './model'

export const AuthApi = defineAPI({
  createSession: POST `/session` // prettier-ignore
    .body(Credentials)
    .response(Void),
  deleteSession: DELETE `/session` // prettier-ignore
  // TODO: getCsrfToken
})
