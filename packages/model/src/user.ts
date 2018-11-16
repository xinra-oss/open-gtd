import { Record, Static, String } from 'runtypes'
import { Entity } from './entity'

export const User = Entity.And(
  Record({
    email: String,
    password: String
  })
)

export type User = Static<typeof User>
