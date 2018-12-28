import { Record, Static, String } from 'runtypes'
import { Entity } from './entity.model'

export const UserEntity = Entity.And(
  Record({
    email: String
  })
)

export type UserEntity = Static<typeof UserEntity>
