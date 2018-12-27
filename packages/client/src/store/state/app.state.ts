import { RouterState } from 'connected-react-router'
import { DeepReadonly } from 'ts-essentials'
import { AuthState } from './auth.state'

export type AppState = DeepReadonly<{
  router: RouterState
  auth: AuthState
}>
