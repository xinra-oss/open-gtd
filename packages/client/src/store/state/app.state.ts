import { AuthState } from './auth.state'

export interface AppState {
  readonly auth: AuthState
}
