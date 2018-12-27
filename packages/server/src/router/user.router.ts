import {
  EmptyResponse,
  User,
  UserApi,
  ValidationException
} from '@open-gtd/api'
import { hash } from 'bcrypt'
import { RouterDefinition } from 'rest-ts-express'
import { db } from '../db'
import { logger } from '../logging'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async (req, res) => {
    const user = req.body

    if (
      (await db
        .userCollection()
        .find({ email: user.email })
        .count()) > 0
    ) {
      throw new ValidationException<User>({
        email: 'Email address is already in use.'
      })
    }
    const insertUser: User = {
      ...user,
      password: await hash(user.password, 10)
    }
    const insertedElement = await db.userCollection().insertOne(insertUser)
    logger.debug('Created user', insertedElement.ops[0])
    return EmptyResponse
  }
}
