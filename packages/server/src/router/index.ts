import { OpenGtdApi } from '@open-gtd/api'
import { createRouter } from 'rest-ts-express'
import { TaskRouter } from './task'
import { UserRouter } from './user'
import { AuthRouter } from './auth'

export const OpenGtdRouter = createRouter(OpenGtdApi, {
  ...AuthRouter,
  ...UserRouter,
  ...TaskRouter
})
