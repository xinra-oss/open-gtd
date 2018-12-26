import { RouterState } from 'connected-react-router'
import { AuthState } from './auth.state'

export interface AppState {
  readonly router: RouterState
  readonly auth: AuthState
}
