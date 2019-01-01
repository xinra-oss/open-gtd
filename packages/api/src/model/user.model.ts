import { Record, Static, String } from 'runtypes'
import { Entity, EntityId } from './entity.model'

export const UserEntity = Entity.And(
  Record({
    email: String,
    inboxTaskId: EntityId
  })
)

export type UserEntity = Static<typeof UserEntity>
