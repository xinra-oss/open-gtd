import { defineAPI } from 'rest-ts-core'
import { TaskApi } from './task'
import { UserApi } from './user'

export const OpenGtdApi = defineAPI({
  ...TaskApi,
  ...UserApi
})
