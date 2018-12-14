import { Record, Static, String } from 'runtypes'

export const Credentials = Record({
  email: String,
  password: String
})

export type Credentials = Static<typeof Credentials>
