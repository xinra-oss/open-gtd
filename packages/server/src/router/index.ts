import { EntityId, OpenGtdApi } from '@open-gtd/api'
import { createRouter } from 'rest-ts-express'
import { ContextRouter } from './context.router'
import { AuthRouter } from './session.router'
import { TaskRouter } from './task.router'
import { UserRouter } from './user.router'

/**
 * Use this when creating new `Entity`s to set `_id`=`undefined` in a typesafe
 * manner. This will cause MongoDB to generate a new ID.
 */
export const WILL_BE_GENERATED_PLACEHOLDER = (undefined as unknown) as EntityId

export const OpenGtdRouter = createRouter(OpenGtdApi, {
  ...AuthRouter,
  ...ContextRouter,
  ...UserRouter,
  ...TaskRouter
})
