import { AuthApi } from '@open-gtd/api'
import { UnauthorizedHttpException } from '@senhung/http-exceptions'
import { compare } from 'bcrypt'
import { RouterDefinition } from 'rest-ts-express'
import { signUserIn, signUserOut } from '../auth'
import { db } from '../db'

export const AuthRouter: RouterDefinition<typeof AuthApi> = {
  createSession: async (req, res) => {
    const credentials = req.body
    const userId = await checkCredentials(
      credentials.email,
      credentials.password
    )
    if (credentials && userId !== null && userId !== undefined) {
      signUserIn(req, userId)
      res.sendStatus(200)
    } else {
      throw new UnauthorizedHttpException('Invalid username or password.')
    }
  },
  deleteSession: (req, res) => {
    signUserOut(req)
    res.sendStatus(200)
  }
}

async function checkCredentials(email: string, password: string) {
  const result = await db
    .userCollection()
    .findOne({ $text: { $search: email, $caseSensitive: false } })
  if (result && (await compare(password, result.password))) {
    return result._id
  }
  return null
}
