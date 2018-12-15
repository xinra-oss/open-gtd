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

export const NewTask = Entity.And(
  Record({
    contextIds: Array(Context),
    isDone: Boolean,
    isFolder: Boolean,
    isNeverActive: Boolean,
    isProject: Boolean,
    title: String.withConstraint(
      s =>
        s.length <= 50 ||
        `the title must have a maximal length of 50 characters`
    )
  })
).And(
  Partial({
    dueDate: InstanceOf(Date),
    notes: String,
    parentId: EntityId,
    startDate: InstanceOf(Date)
  })
)

export const Task = NewTask.And(
  Record({
    userId: EntityId
  })
)

export type Task = Static<typeof Task>
export type NewTask = Static<typeof NewTask>
