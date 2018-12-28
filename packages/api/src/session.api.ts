import { defineAPI, DELETE, GET, POST } from 'rest-ts-core'
import { Credentials, Session } from './model'

export const AuthApi = defineAPI({
  createSession: POST `/session` // prettier-ignore
    .body(Credentials)
    .response(Session),
  deleteSession: DELETE `/session` // prettier-ignore
    .response(Session),
  getSession: GET `/session` // prettier-ignore
    .response(Session)
})
