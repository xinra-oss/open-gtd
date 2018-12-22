import {
  NotFoundHttpException,
  Task,
  TaskApi,
  ValidationException
} from '@open-gtd/api'
import { ObjectId } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'
import { getUserId } from '../auth'
import { db } from '../db'

export const TaskRouter: RouterDefinition<typeof TaskApi> = {
  createTask: async req => {
    const newTask = req.body
    const task = {
      ...newTask,
      userId: getUserId(req)
    }
    if (newTask.parentId !== undefined) {
      const parentTask = await db
        .taskCollection()
        .findOne({ _id: new ObjectId(task.parentId) })
      if (!parentTask) {
        throw new ValidationException<Task>({
          parentId: 'Parent does not exist.'
        })
      } else if (parentTask.userId !== task.userId) {
        throw new ValidationException<Task>({
          userId: 'Parent has different userId.'
        })
      }
    }
    if (newTask.contextIds.length > 0) {
      for (const contextId in task.contextIds) {
        if (task.contextIds.hasOwnProperty(contextId)) {
          const element = task.contextIds[contextId]
          const context = await db
            .contextCollection()
            .findOne({ _id: new ObjectId(element) })
          if (!context) {
            throw new ValidationException<Task>({
              contextIds: 'contextId does not exist.'
            })
          }
          if (context.userId !== task.userId) {
            throw new ValidationException<Task>({
              contextIds: 'Context belongs to different user.'
            })
          }
        }
      }
    }

    const insertedElement = await db.taskCollection().insertOne(task)
    return insertedElement.ops[0]
  },
  deleteTask: async (req, res) => {
    if (
      (await db
        .taskCollection()
        .find({ _id: new ObjectId(req.params.id) })
        .count()) === 0
    ) {
      throw new NotFoundHttpException()
    }
    await db.taskCollection().deleteOne({ _id: new ObjectId(req.params.id) })
    res.sendStatus(200)
  },
  getTask: async req => {
    const result = await db
      .taskCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (result === null) {
      throw new NotFoundHttpException()
    }
    return result
  },
  getTaskList: async req => {
    const result = await db
      .taskCollection()
      .find({ userId: getUserId(req) })
      .toArray()
    return result
  },
  updateTask: async req => {
    const task = req.body
    if (
      (await db
        .taskCollection()
        .find({ _id: new ObjectId(req.params.id) })
        .count()) === 0
    ) {
      throw new NotFoundHttpException()
    }
    await db
      .taskCollection()
      .replaceOne({ _id: new ObjectId(req.params.id) }, task)
    return task
  }
}
