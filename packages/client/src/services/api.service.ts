import { OpenGtdApi } from '@open-gtd/api'
import Axios from 'axios'
import { createConsumer } from 'rest-ts-axios'

const driver = Axios.create({
  baseURL: 'http://localhost:3001/api'
})

export const openGtdApi = createConsumer(OpenGtdApi, driver)

export type OpenGtdApiConsumer = typeof openGtdApi
