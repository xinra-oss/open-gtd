import { Record, Static, String } from 'runtypes'
import { Entity, EntityId } from './entity'

export const Context = Entity.And(
  Record({
    name: String,
    userId: EntityId
  })
)

export type Context = Static<typeof Context>
