import { defineAPI, DELETE, GET, POST } from 'rest-ts-core'
import { Array } from 'runtypes'
import { Context } from './model'

export const ContextApi = defineAPI({
  createContext: POST `/contexts` // prettier-ignore
    .body(Context)
    .response(Context),
  getContext: GET `/contexts/${'id'}` // prettier-ignore
    .response(Context),
  getContextList: GET `/contexts` // prettier-ignore
    .response(Array(Context)),
  deleteContext: DELETE `/contexts/${'id'}` // prettier-ignore
})
