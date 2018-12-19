import { TaskApi } from '@open-gtd/api'
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
      if (
        (await db
          .taskCollection()
          .find({ _id: new ObjectId(task.parentId) })
          .count()) === 0
      ) {
        // TODO: implement proper error handling
        throw new Error('parentId is set but does not exist in database')
      }
    }

    const insertedElement = await db.taskCollection().insertOne(task)
    return insertedElement.ops[0]
  },
  deleteTask: async req => {
    if (
      (await db
        .taskCollection()
        .find({ _id: new ObjectId(req.params.id) })
        .count()) === 0
    ) {
      // TODO: implement proper error handling
      throw new Error('requested taskId does not exist in database')
    } else {
      await db.taskCollection().deleteOne({ _id: new ObjectId(req.params.id) })
    }
    // TODO: implement proper HTTP response (message "Cannot DELETE /api/tasks/:id" although deleting...)
  },
  getTask: async req => {
    const result = await db
      .taskCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (result === null) {
      // TODO: implement proper error handling
      throw new Error('requested taskId does not exist in database')
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
      // TODO: implement proper error handling
      throw new Error('requested taskId does not exist in database')
    }
    await db
      .taskCollection()
      .replaceOne({ _id: new ObjectId(req.params.id) }, task)
    return task
  }
}
