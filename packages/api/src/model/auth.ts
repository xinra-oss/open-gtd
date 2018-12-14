import { Record, Static, String } from 'runtypes'
import { isEmail } from 'validator'

export const Credentials = Record({
  email: String.withConstraint(s => isEmail(s) || `email address is not valid`),
  password: String.withConstraint(
    s => s.length >= 8 || `password must be at least 8 characters long`
  )
})

export type Credentials = Static<typeof Credentials>
