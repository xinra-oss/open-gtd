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
import { sync } from '../sync'

export const ContextRouter: RouterDefinition<typeof ContextApi> = {
  createContext: async req => {
    let context: ContextEntity = {
      ...req.body,
      _id: WILL_BE_GENERATED_PLACEHOLDER,
      userId: getUserId(req)
    }
    context = (await db.contextCollection().insertOne(context)).ops[0]
    sync.push(
      {
        eventType: 'create',
        payloadType: 'context',
        payload: context
      },
      req
    )
    return context
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
    await db.contextCollection().deleteOne({ _id: new ObjectId(context._id) })
    await db.taskCollection().updateMany(
      {},
      {
        $pull: { contextIds: context._id as any }
      }
    )
    sync.push(
      {
        eventType: 'delete',
        payloadType: 'context',
        payload: [{ _id: context._id }]
      },
      req
    )
    return { _id: context._id }
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

    sync.push(
      {
        eventType: 'update',
        payloadType: 'context',
        payload: newContext
      },
      req
    )
    return newContext
  }
}
