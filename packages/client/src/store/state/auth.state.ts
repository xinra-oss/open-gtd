import { User } from '@open-gtd/api'
import { DeepReadonly } from 'utility-types'

export type AuthState = DeepReadonly<{
  user?: User
}>
