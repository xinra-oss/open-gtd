import { defineAPI } from 'rest-ts-core'
import { TaskApi } from './task'
import { UserApi } from './user'
import { AuthApi } from './auth'

// export type OpenGtdApi = TaskApi & UserApi

export const OpenGtdApi = defineAPI({
  ...AuthApi,
  ...TaskApi,
  ...UserApi
})

export { TaskApi, UserApi, AuthApi }
export * from './model'
