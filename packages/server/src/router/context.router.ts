import {
  ContextApi,
  ContextEntity,
  ForbiddenHttpException,
  NotFoundHttpException
} from '@open-gtd/api'
import { ObjectId } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'
import { WILL_BE_GENERATED_PLACEHOLDER } from '.'
import { getUserId } from '../auth'
import { db } from '../db'

export const ContextRouter: RouterDefinition<typeof ContextApi> = {
  createContext: async req => {
    const context: ContextEntity = {
      ...req.body,
      _id: WILL_BE_GENERATED_PLACEHOLDER,
      userId: getUserId(req)
    }
    const insertedElement = await db.contextCollection().insertOne(context)
    return insertedElement.ops[0]
  },
  getContext: async req => {
    const context = await db
      .contextCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (context === null) {
      throw new NotFoundHttpException()
    } else if (context.userId !== getUserId(req)) {
      throw new ForbiddenHttpException()
    }
    return context
  },
  getContextList: async req => {
    const result = await db
      .contextCollection()
      .find({ userId: getUserId(req) })
      .toArray()
    return result
  },
  deleteContext: async (req, res) => {
    const context = await db
      .contextCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (context === null) {
      throw new NotFoundHttpException()
    } else if (context.userId !== getUserId(req)) {
      throw new ForbiddenHttpException()
    }
    await db.contextCollection().deleteOne({ _id: new ObjectId(req.params.id) })
    return { _id: req.params.id }
  },
  updateContext: async (req, res) => {
    const oldContext = await db
      .contextCollection()
      .findOne({ _id: new ObjectId(req.params.id) })

    if (oldContext === null) {
      throw new NotFoundHttpException()
    }
    if (oldContext.userId !== getUserId(req)) {
      throw new ForbiddenHttpException()
    }
    const newContext = {
      ...oldContext,
      ...req.body
    }
    await db
      .contextCollection()
      .replaceOne({ _id: new ObjectId(req.params.id) }, newContext)
    return newContext
  }
}
