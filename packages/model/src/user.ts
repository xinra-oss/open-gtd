import { Record, Static, String } from 'runtypes'
import { isEmail } from 'validator'
import { Entity } from './entity'

export const User = Entity.And(
  Record({
    email: String.withConstraint(
      s => isEmail(s) || `email address is not valid`
    ),
    password: String.withConstraint(
      s => s.length >= 8 || `password must be at least 8 characters long`
    )
  })
)

export type User = Static<typeof User>
