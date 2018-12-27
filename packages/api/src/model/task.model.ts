import {
  Array,
  Boolean,
  InstanceOf,
  Partial,
  Record,
  Static,
  String
} from 'runtypes'
import { Entity, EntityId } from './entity.model'

export const Task = Record({
  contextIds: Array(EntityId),
  isDone: Boolean,
  isFolder: Boolean,
  isNeverActive: Boolean,
  isProject: Boolean,
  title: String.withConstraint(
    s =>
      s.length <= 50 || `the title must have a maximal length of 50 characters`
  )
}).And(
  Partial({
    dueDate: InstanceOf(Date),
    notes: String,
    parentId: EntityId,
    startDate: InstanceOf(Date)
  })
)

export const TaskEntity = Task.And(Entity).And(
  Record({
    userId: EntityId
  })
)

export type TaskEntity = Static<typeof TaskEntity>
export type Task = Static<typeof Task>
