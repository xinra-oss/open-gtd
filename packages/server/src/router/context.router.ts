import { ContextApi } from '@open-gtd/api'
import { RouterDefinition } from 'rest-ts-express'
import { getUserId } from '../auth'
import { db } from '../db'

export const ContextRouter: RouterDefinition<typeof ContextApi> = {
  createContext: async req => {
    const context = req.body
    context.userId = getUserId(req)
    const insertedElement = await db.contextCollection().insertOne(context)
    return insertedElement.ops[0]
  },
  getContextList: async req => {
    const result = await db
      .contextCollection()
      .find({ userId: getUserId(req) })
      .toArray()
    return result
  }
}
