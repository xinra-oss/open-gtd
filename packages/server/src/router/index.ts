import { OpenGtdApi } from '@open-gtd/api'
import { createRouter } from 'rest-ts-express'
import { AuthRouter } from './auth'
import { TaskRouter } from './task'
import { UserRouter } from './user'

export const OpenGtdRouter = createRouter(OpenGtdApi, {
  ...AuthRouter,
  ...UserRouter,
  ...TaskRouter
})
