import {
  EntityId,
  ForbiddenHttpException,
  NotFoundHttpException,
  Task,
  TaskApi,
  TaskEntity,
  ValidationException
} from '@open-gtd/api'
import { ObjectId } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'
import { WILL_BE_GENERATED_PLACEHOLDER } from '.'
import { getUserId } from '../auth'
import { db } from '../db'
import { sync } from '../sync'

export const TaskRouter: RouterDefinition<typeof TaskApi> = {
  createTask: async req => {
    let task: TaskEntity = {
      ...req.body,
      _id: WILL_BE_GENERATED_PLACEHOLDER,
      userId: getUserId(req)
    }
    if (task.parentId !== null) {
      const parentError = await checkParentTask(
        task._id,
        task.parentId,
        task.userId
      )
      if (parentError) {
        throw new ValidationException<Task>({
          parentId: parentError
        })
      }
    }
    const contextError = await checkContextIds(task.contextIds, task.userId)
    if (contextError) {
      throw new ValidationException<Task>({
        contextIds: contextError
      })
    }

    task = (await db.taskCollection().insertOne(task)).ops[0]
    sync.push(
      {
        eventType: 'create',
        payloadType: 'task',
        payload: task
      },
      req
    )
    return task
  },
  deleteTask: async (req, res) => {
    const task = await db
      .taskCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (task === null) {
      throw new NotFoundHttpException()
    } else if (task.userId !== getUserId(req)) {
      throw new ForbiddenHttpException()
    }
    await checkIsNotInboxTask(task, getUserId(req))

    const taskAndAllDecendants = [
      task._id,
      ...(await getAllDescendantIds(task._id.toString()))
    ].map(id => ({ _id: id }))

    await db.taskCollection().deleteMany({
      _id: { $in: taskAndAllDecendants.map(t => new ObjectId(t._id)) }
    })

    sync.push(
      {
        eventType: 'delete',
        payloadType: 'task',
        payload: taskAndAllDecendants
      },
      req
    )
    return taskAndAllDecendants
  },
  getTask: async req => {
    const task = await db
      .taskCollection()
      .findOne({ _id: new ObjectId(req.params.id) })
    if (task === null) {
      throw new NotFoundHttpException()
    } else if (task.userId !== getUserId(req)) {
      throw new ForbiddenHttpException()
    }
    return task
  },
  getTaskList: async req => {
    const result = await db
      .taskCollection()
      .find({ userId: getUserId(req) })
      .toArray()
    return result
  },
  updateTask: async req => {
    const oldTask = await db
      .taskCollection()
      .findOne({ _id: new ObjectId(req.params.id) })

    if (oldTask === null) {
      throw new NotFoundHttpException()
    } else if (oldTask.userId !== getUserId(req)) {
      throw new ForbiddenHttpException()
    }

    const newTask: TaskEntity = {
      ...oldTask,
      ...req.body
    }

    if (newTask.parentId !== null) {
      const parentError = await checkParentTask(
        newTask._id,
        newTask.parentId,
        newTask.userId
      )
      if (parentError) {
        throw new ValidationException<Task>({
          parentId: parentError
        })
      }
    }
    const contextError = await checkContextIds(
      newTask.contextIds,
      newTask.userId
    )
    if (contextError) {
      throw new ValidationException<Task>({
        contextIds: contextError
      })
    }

    await db
      .taskCollection()
      .replaceOne({ _id: new ObjectId(req.params.id) }, newTask)

    sync.push(
      {
        eventType: 'update',
        payloadType: 'task',
        payload: newTask
      },
      req
    )
    return newTask
  }
}

async function checkParentTask(
  taskId: string,
  parentId: string,
  userId: string
) {
  if (
    taskId !== WILL_BE_GENERATED_PLACEHOLDER &&
    taskId.toString() === parentId
  ) {
    return 'Task cannot have itself as parent.'
  }

  const parentTask = await db
    .taskCollection()
    .findOne({ _id: new ObjectId(parentId) })
  if (!parentTask) {
    return 'Parent does not exist.'
  }
  if (parentTask.userId !== userId) {
    return 'Parent belongs to different user.'
  }

  if (
    parentTask.parentId &&
    taskId !== WILL_BE_GENERATED_PLACEHOLDER &&
    !(await checkParentHierarchy(taskId.toString(), parentTask.parentId))
  ) {
    return 'ParentId creates circular reference.'
  }
  return null
}

async function checkParentHierarchy(
  taskId: string,
  parentId: string
): Promise<boolean> {
  if (taskId === parentId) {
    return false
  }
  const parentTask = await db
    .taskCollection()
    .findOne({ _id: new ObjectId(parentId) })

  if (parentTask && parentTask.parentId !== null) {
    return await checkParentHierarchy(taskId, parentTask.parentId)
  }
  return true
}

async function checkContextIds(contextIds: string[], userId: string) {
  for (const contextId of contextIds) {
    const context = await db
      .contextCollection()
      .findOne({ _id: new ObjectId(contextId) })
    if (!context) {
      return 'contextId does not exist.'
    }
    if (context.userId !== userId) {
      return 'Context belongs to different user.'
    }
  }
  return null
}

async function getAllDescendantIds(taskId: EntityId) {
  const childIds: EntityId[] = (await db
    .taskCollection()
    .find({ parentId: taskId })
    .toArray()).map(t => t._id.toString())

  let descendantIds = [...childIds]
  for (const childId of childIds) {
    descendantIds = descendantIds.concat(await getAllDescendantIds(childId))
  }
  return descendantIds
}

async function checkIsNotInboxTask(task: TaskEntity, userId: EntityId) {
  const user = await db.userCollection().findOne({ _id: new ObjectId(userId) })
  if (user === null) {
    throw new Error('checkIsNotInboxTask: user does not exist')
  }
  if (user.inboxTaskId === task._id.toString()) {
    throw new ForbiddenHttpException('Inbox task cannot be deleted.')
  }
}
