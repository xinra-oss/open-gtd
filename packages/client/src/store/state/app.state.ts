import { DeepReadonly } from 'utility-types'
import { AuthState } from './auth.state'

export type AppState = DeepReadonly<{
  auth: AuthState
}>
