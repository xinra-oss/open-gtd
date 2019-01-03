import { TaskEntity } from '@open-gtd/api'
import { Dictionary } from 'ts-essentials'

/**
 * key = task._id
 */
export type TaskState = Dictionary<TaskEntity>
