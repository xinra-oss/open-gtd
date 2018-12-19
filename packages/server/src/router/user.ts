import { User, UserApi, ValidationException } from '@open-gtd/api'
import { hash } from 'bcrypt'
import { RouterDefinition } from 'rest-ts-express'
import { db } from '../db'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body

    if (
      (await db
        .userCollection()
        .find({ email: user.email })
        .count()) > 0
    ) {
      throw new ValidationException<User>({
        email: 'E-Mail address is already in use.'
      })
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
