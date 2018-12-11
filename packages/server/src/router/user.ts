import { UserApi } from '@open-gtd/api'
import { User } from '@open-gtd/model'
import { RouterDefinition } from 'rest-ts-express'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body as User
    // TODO: check email address for uniqueness before inserting to database
    // TODO: return user object from database (id is created on inserting)
    // TODO: hash password before storing in database
    return user
  }
}
