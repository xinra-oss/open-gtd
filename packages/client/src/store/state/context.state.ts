import { ContextEntity } from '@open-gtd/api'
import { Dictionary } from 'ts-essentials'

/**
 * key = context._id
 */
export type ContextState = Dictionary<ContextEntity>
