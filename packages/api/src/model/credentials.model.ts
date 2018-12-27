import { Record, Static, String } from 'runtypes'
import { isEmail } from 'validator'
import { Entity, EntityId } from './entity.model'

export const Credentials = Record({
  email: String.withConstraint(s => isEmail(s) || `email address is not valid`),
  password: String.withConstraint(
    s => s.length >= 8 || `password must be at least 8 characters long`
  )
})

export const CredentialsEntity = Credentials.And(Entity).And(
  Record({ userId: EntityId })
)

export type Credentials = Static<typeof Credentials>
export type CredentialsEntity = Static<typeof CredentialsEntity>
