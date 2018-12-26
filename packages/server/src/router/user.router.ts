import { User, UserApi, ValidationException } from '@open-gtd/api'
import { hash } from 'bcrypt'
import { RouterDefinition } from 'rest-ts-express'
import { db } from '../db'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async (req, res) => {
    const user = req.body
    user.email = user.email.toLowerCase()

    if (
      (await db
        .userCollection()
        .find({ email: user.email })
        .count()) > 0
    ) {
      throw new ValidationException<User>({
        email: 'Email address is already in use.'
      })
    } else {
      const insertUser: User = {
        ...user,
        password: await hash(user.password, 10)
      }
      if (await db.userCollection().insertOne(insertUser)) {
        res.sendStatus(200)
      }
    }
  }
}
