import {
  Credentials,
  CredentialsEntity,
  EmptyResponse,
  TaskEntity,
  UserApi,
  UserEntity,
  ValidationException
} from '@open-gtd/api'
import { hash } from 'bcrypt'
import { RouterDefinition } from 'rest-ts-express'
import { WILL_BE_GENERATED_PLACEHOLDER } from '.'
import { db } from '../db'
import { logger } from '../logging'

export const UserRouter: RouterDefinition<typeof UserApi> = {
  createUser: async (req, res) => {
    const emailLowerCase = req.body.email.toLowerCase()

    if (await db.credentialsCollection().findOne({ email: emailLowerCase })) {
      throw new ValidationException<Credentials>({
        email: 'Email address is already in use.'
      })
    }

    let inboxTask: TaskEntity = {
      _id: WILL_BE_GENERATED_PLACEHOLDER,
      contextIds: [],
      dueDate: null,
      isDone: false,
      isFolder: true,
      isNeverActive: true,
      isProject: false,
      notes: null,
      parentId: null,
      startDate: null,
      title: '<Inbox>',
      userId: WILL_BE_GENERATED_PLACEHOLDER
    }

    inboxTask = (await db.taskCollection().insertOne(inboxTask)).ops[0]

    let user: UserEntity = {
      _id: WILL_BE_GENERATED_PLACEHOLDER,
      email: req.body.email, // save user-defined casing
      inboxTaskId: inboxTask._id.toString()
    }
    user = (await db.userCollection().insertOne(user)).ops[0]

    inboxTask.userId = user._id.toString()
    await db.taskCollection().replaceOne({ _id: inboxTask._id }, inboxTask)

    const credentials: CredentialsEntity = {
      _id: WILL_BE_GENERATED_PLACEHOLDER,
      email: emailLowerCase,
      password: await hash(req.body.password, 10),
      userId: user._id.toString()
    }

    await db.credentialsCollection().insertOne(credentials)

    logger.debug('Created user', user)
    return EmptyResponse
  }
}
