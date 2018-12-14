import { User, UserApi } from '@open-gtd/api'
import { RouterDefinition } from 'rest-ts-express'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body as User
    // TODO
    return user
  }
}
