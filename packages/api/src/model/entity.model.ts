import { Record, Static, String } from 'runtypes'
import { isHexadecimal } from 'validator'

export const EntityId = String.withConstraint(
  id => (isHexadecimal(id) && id.length === 24) || `id is not valid`
)

export const Entity = Record({
  _id: EntityId
})

export type Entity = Static<typeof Entity>
export type EntityId = Static<typeof EntityId>
