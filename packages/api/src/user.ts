import { User } from '@open-gtd/model'
import { ApiDefinition, POST } from 'rest-ts-core'

export const UserApi: ApiDefinition = {
  createUser: POST(`/users`)
    .body(User)
    .response(User)
}
