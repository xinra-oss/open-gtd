import { Static } from 'runtypes'
import { Credentials } from './auth'
import { Entity } from './entity'

export const User = Entity.And(Credentials)

export type User = Static<typeof User>
