import { TaskApi } from '@open-gtd/api'
import { MongoClient, ObjectId } from 'mongodb'
import { Task } from 'packages/model/lib'
import { RouterDefinition } from 'rest-ts-express'

export const TaskRouter: RouterDefinition<typeof TaskApi> = {
  createTask: async req => {
    const newTask = req.body
    // TODO: implement getting user id from session instead of 'abc123...'
    const task: Task = {
      ...newTask,
      userId: 'abc123abc123abc123abc123'
    }
    const db = await MongoClient.connect('mongodb://localhost:27017/')
    const dbo = db.db('open-gtd')
    if (newTask.parentId !== undefined) {
      if (
        (await dbo
          .collection('tasks')
          .find({ _id: new ObjectId(task.parentId) })
          .count()) === 0
      ) {
        // TODO: implement proper error handling
        return 'parentId is set but does not exist in database'
      }
    }

    if (
      (await dbo
        .collection('users')
        .find({ _id: new ObjectId(task.userId) })
        .count()) === 0
    ) {
      // TODO: implement proper error handling
      return 'userId does not exist in database'
    }

    const insertedElement = await dbo.collection('tasks').insertOne(task)
    return insertedElement.ops[0]
  },
  deleteTask: async req => {
    const db = await MongoClient.connect('mongodb://localhost:27017/')
    const dbo = db.db('open-gtd')
    if (
      (await dbo
        .collection('tasks')
        .find({ _id: new ObjectId(req.params.id) })
        .count()) === 0
    ) {
      // TODO: implement proper error handling
      console.error('requested taskId does not exist in database')
    } else {
      await dbo
        .collection('tasks')
        .deleteOne({ _id: new ObjectId(req.params.id) })
    }
    // TODO: implement proper HTTP response ("Cannot DELETE /api/tasks/:id" although deleting...)
  },
  updateTask: async req => {
    const task = req.body
    // TODO
    return task
  }
}
