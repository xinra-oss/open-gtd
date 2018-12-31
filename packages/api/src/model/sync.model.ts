import { ContextEntity } from './context.model'
import { Entity } from './entity.model'
import { TaskEntity } from './task.model'

export type SyncEvent<T extends string, P> =
  | {
      eventType: 'create' | 'update'
      payloadType: T
      payload: P
    }
  | {
      eventType: 'delete'
      payloadType: T
      payload: Entity[]
    }

export type AppSyncEvent =
  | SyncEvent<'task', TaskEntity>
  | SyncEvent<'context', ContextEntity>
