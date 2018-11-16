import { Partial, Static, String } from 'runtypes'

export const EntityId = String

export const Entity = Partial({
  id: EntityId
})

export type Entity = Static<typeof Entity>
