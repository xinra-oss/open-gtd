import { Session } from '@open-gtd/api'
import { RouterState } from 'connected-react-router'
import { DeepReadonly } from 'ts-essentials'

export type AppState = DeepReadonly<{
  router: RouterState
  session: Session
}>
