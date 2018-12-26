import { defineAPI, POST } from 'rest-ts-core'
import { Credentials, EmptyResponse } from './model'

export const UserApi = defineAPI({
  createUser: POST `/users` // prettier-ignore
    .body(Credentials)
    .response(EmptyResponse)
})
