import { defineAPI, DELETE, POST } from 'rest-ts-core'
import { Credentials, User } from './model'
import { EmptyResponse } from './model/misc.model'

export const AuthApi = defineAPI({
  createSession: POST `/session` // prettier-ignore
    .body(Credentials)
    .response(User),
  deleteSession: DELETE `/session` // prettier-ignore
    .response(EmptyResponse)
  // TODO: getCsrfToken
})
