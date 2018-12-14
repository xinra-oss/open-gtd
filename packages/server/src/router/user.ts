import { User, UserApi } from '@open-gtd/api'
import { hash } from 'bcrypt'
import { MongoClient } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body as User

    const db = await MongoClient.connect('mongodb://localhost:27017/')
    const dbo = await db.db('open-gtd')
    if (
      (await dbo
        .collection('users')
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
      const insertedElement = await dbo
        .collection('users')
        .insertOne(insertUser)
      return insertedElement.ops[0]
    }
  }
}
