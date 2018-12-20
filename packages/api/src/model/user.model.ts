import { Static } from 'runtypes'
import { Credentials } from './auth.model'
import { Entity } from './entity.model'

export const User = Entity.And(Credentials)

export type User = Static<typeof User>
