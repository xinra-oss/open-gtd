import { Session } from '@open-gtd/api'
import { RouterState } from 'connected-react-router'
import { DeepReadonly } from 'ts-essentials'
import { ContextState } from './context.state'
import { InfoState } from './info.state'
import { SyncState } from './sync.state'
import { TaskState } from './task.state'

export type AppState = DeepReadonly<{
  router: RouterState
  session: Session
  loading: boolean
  tasks: TaskState
  contexts: ContextState
  sync: SyncState
  info: InfoState
}>
