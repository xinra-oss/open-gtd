import { UserApi } from '@open-gtd/api'
import { User } from '@open-gtd/model'
import { MongoClient } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async req => {
    const user = req.body as User
    // TODO: hash password before storing in database

    const db = await MongoClient.connect('mongodb://localhost:27017/')
    const dbo = await db.db('open-gtd')
    if (
      (await dbo
        .collection('users')
        .find({ email: user.email })
        .count()) > 0
    ) {
      // TODO: implement proper error handling
      return 'mail address is already in use'
    } else {
      const insertedElement = await dbo.collection('users').insertOne(user)
      return insertedElement.ops[0]
    }
  }
}
