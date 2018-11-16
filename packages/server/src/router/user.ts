import { UserApi } from '@open-gtd/api'
import { User } from '@open-gtd/model'
import { RouterDefinition } from 'rest-ts-express'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body as User
    // TODO
    return user
  }
}
