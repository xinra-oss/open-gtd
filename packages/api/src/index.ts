import { defineAPI } from 'rest-ts-core'
import { AuthApi } from './auth'
import { TaskApi } from './task'
import { UserApi } from './user'

// export type OpenGtdApi = TaskApi & UserApi

export const OpenGtdApi = defineAPI({
  ...AuthApi,
  ...TaskApi,
  ...UserApi
})

export { TaskApi, UserApi, AuthApi }
export * from './model'
