import { Record, Static, String } from 'runtypes'
import { Entity, EntityId } from './entity.model'

export const Context = Record({
  name: String
})

export const ContextEntity = Context.And(Entity).And(
  Record({
    userId: EntityId
  })
)

export type Context = Static<typeof Context>
export type ContextEntity = Static<typeof ContextEntity>
