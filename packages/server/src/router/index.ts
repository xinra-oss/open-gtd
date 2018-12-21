import { OpenGtdApi } from '@open-gtd/api'
import { createRouter } from 'rest-ts-express'
import { AuthRouter } from './auth.router'
import { TaskRouter } from './task.router'
import { UserRouter } from './user.router'

export const OpenGtdRouter = createRouter(OpenGtdApi, {
  ...AuthRouter,
  ...UserRouter,
  ...TaskRouter
})
