import { defineAPI } from 'rest-ts-core'
import { AuthApi } from './auth.api'
import { TaskApi } from './task.api'
import { UserApi } from './user.api'

// export type OpenGtdApi = TaskApi & UserApi

export const OpenGtdApi = defineAPI({
  ...AuthApi,
  ...TaskApi,
  ...UserApi
})

export { TaskApi, UserApi, AuthApi }
export * from './model'
