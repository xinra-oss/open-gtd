import { ContextApi, NotFoundHttpException } from '@open-gtd/api'
import { ObjectId } from 'mongodb'
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
  getContext: async req => {
    const result = await db
      .contextCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (result === null) {
      throw new NotFoundHttpException()
    }
    return result
  },
  getContextList: async req => {
    const result = await db
      .contextCollection()
      .find({ userId: getUserId(req) })
      .toArray()
    return result
  },
  deleteContext: async (req, res) => {
    if (
      (await db
        .contextCollection()
        .find({ _id: new ObjectId(req.params.id) })
        .count()) === 0
    ) {
      throw new NotFoundHttpException()
    }
    await db.contextCollection().deleteOne({ _id: new ObjectId(req.params.id) })
    res.sendStatus(200)
  },
  updateContext: async (req, res) => {
    const context = req.body
    if (
      (await db
        .contextCollection()
        .find({ _id: new ObjectId(req.params.id) })
        .count()) === 0
    ) {
      throw new NotFoundHttpException()
    }
    await db
      .contextCollection()
      .replaceOne({ _id: new ObjectId(req.params.id) }, context)
    return context
  }
}
