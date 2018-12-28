import { defineAPI } from 'rest-ts-core'
import { ContextApi } from './context.api'
import { AuthApi } from './session.api'
import { TaskApi } from './task.api'
import { UserApi } from './user.api'

export const OpenGtdApi = defineAPI({
  ...AuthApi,
  ...ContextApi,
  ...TaskApi,
  ...UserApi
})

export { TaskApi, UserApi, AuthApi, ContextApi }
export * from './model'
