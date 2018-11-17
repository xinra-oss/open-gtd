import {
  Array,
  Boolean,
  InstanceOf,
  Partial,
  Record,
  Static,
  String
} from 'runtypes'
import { Context } from './context'
import { Entity, EntityId } from './entity'

export const Task = Entity.And(
  Record({
    contextIds: Array(Context),
    isDone: Boolean,
    isFolder: Boolean,
    isNeverActive: Boolean,
    isProject: Boolean,
    title: String,
    userId: EntityId
  })
).And(
  Partial({
    dueDate: InstanceOf(Date),
    notes: String,
    parentId: EntityId,
    startDate: InstanceOf(Date)
  })
)

export type Task = Static<typeof Task>
