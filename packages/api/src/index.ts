import { defineAPI } from 'rest-ts-core'
import { TaskApi } from './task'
import { UserApi } from './user'

// export type OpenGtdApi = TaskApi & UserApi

export const OpenGtdApi = defineAPI({
  ...TaskApi,
  ...UserApi
})

export { TaskApi, UserApi }
