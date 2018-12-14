import { Static } from 'runtypes'
import { Entity } from './entity'
import { Credentials } from './auth'

export const User = Entity.And(Credentials)

export type User = Static<typeof User>
