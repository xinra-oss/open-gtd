import { defineAPI, DELETE, GET, POST, PUT } from 'rest-ts-core'
import { Array } from 'runtypes'
import { Context, ContextEntity, EMPTY_RESPONSE, EmptyResponse } from './model'

export const ContextApi = defineAPI({
  createContext: POST `/contexts` // prettier-ignore
    .body(Context)
    .response(ContextEntity),
  getContext: GET `/contexts/${'id'}` // prettier-ignore
    .response(ContextEntity),
  getContextList: GET `/contexts` // prettier-ignore
    .response(Array(ContextEntity)),
  updateContext: PUT`/contexts/${'id'}` // prettier-ignore
    .body(Context)
    .response(ContextEntity),
  deleteContext: DELETE `/contexts/${'id'}` // prettier-ignore
    .response(EMPTY_RESPONSE)
})
