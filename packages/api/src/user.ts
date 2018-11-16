import { ApiDefinition, POST } from 'rest-ts-core'
import { User } from '@open-gtd/model'

export const UserApi: ApiDefinition = {
  createUser: POST(`/users`)
    .body(User)
    .response(User)
}
