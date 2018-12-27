import { Record, Static, String } from 'runtypes'
import { Entity } from './entity.model'

export const User = Entity.And(
  Record({
    email: String
  })
)

export type User = Static<typeof User>
