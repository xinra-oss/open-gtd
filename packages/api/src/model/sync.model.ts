import { ContextEntity } from './context.model'
import { TaskEntity } from './task.model'

export interface SyncEvent<T extends string, P> {
  eventType: 'create' | 'update' | 'delete'
  payloadType: T
  payload: P
}

export type AppSyncEvent =
  | SyncEvent<'task', TaskEntity>
  | SyncEvent<'context', ContextEntity>
