import {
  Array,
  Boolean,
  InstanceOf,
  Null,
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
  ),
  dueDate: InstanceOf(Date).Or(Null),
  notes: String.Or(Null),
  parentId: EntityId.Or(Null),
  startDate: InstanceOf(Date).Or(Null)
})

export const TaskEntity = Task.And(Entity).And(
  Record({
    userId: EntityId
  })
)

export type TaskEntity = Static<typeof TaskEntity>
export type Task = Static<typeof Task>
