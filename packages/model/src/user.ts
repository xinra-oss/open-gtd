import { Entity } from './entity'

export interface User extends Entity {
  readonly email: string
  readonly passwort: string
}
