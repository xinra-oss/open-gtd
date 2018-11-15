import { Context } from './context'
import { Entity } from './entity'

export interface Task extends Entity {
  readonly title: string
  readonly notes?: string
  readonly dueDate?: Date
  readonly startDate?: Date
  readonly isFolder: boolean
  readonly isProject: boolean
  readonly neverActive: boolean
  readonly done: boolean
  readonly parentId?: string
  readonly userId: string
  readonly contextIds: ReadonlyArray<Context>
}
