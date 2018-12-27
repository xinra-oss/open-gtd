import { Partial, Record, Static, String } from 'runtypes'
import { User } from '.'

export const Session = Record({
  csrfToken: String
}).And(
  Partial({
    user: User
  })
)

export type Session = Static<typeof Session>
