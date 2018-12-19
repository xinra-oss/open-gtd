import { User, UserApi } from '@open-gtd/api'
import { hash } from 'bcrypt'
import { RouterDefinition } from 'rest-ts-express'
import { db } from '../db'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body as User

    if (
      (await db
        .userCollection()
        .find({ email: user.email })
        .count()) > 0
    ) {
      // TODO: implement proper error handling
      throw new Error('mail address is already in use')
    } else {
      const insertUser: User = {
        ...user,
        password: await hash(user.password, 10)
      }
      const insertedElement = await db.userCollection().insertOne(insertUser)
      return insertedElement.ops[0]
    }
  }
}
