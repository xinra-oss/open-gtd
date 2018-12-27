import { defineAPI, POST } from 'rest-ts-core'
import { Credentials, EMPTY_RESPONSE } from './model'

export const UserApi = defineAPI({
  createUser: POST `/users` // prettier-ignore
    .body(Credentials)
    .response(EMPTY_RESPONSE)
})
