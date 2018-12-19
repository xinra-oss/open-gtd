import { Partial, Static, String } from 'runtypes'

export const EntityId = String

export const Entity = Partial({
  _id: EntityId
})

export type Entity = Static<typeof Entity>
export type EntityId = Static<typeof EntityId>
