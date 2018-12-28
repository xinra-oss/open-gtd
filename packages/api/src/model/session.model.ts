import { Partial, Record, Static, String } from 'runtypes'
import { UserEntity } from '.'

export const Session = Record({
  csrfToken: String
}).And(
  Partial({
    user: UserEntity
  })
)

export type Session = Static<typeof Session>
