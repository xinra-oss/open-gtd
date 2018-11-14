import { Entity } from './entity'

export interface Context extends Entity {
  readonly userId: string
  readonly name: string
}
