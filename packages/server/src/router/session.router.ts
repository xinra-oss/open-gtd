import { AuthApi, User } from '@open-gtd/api'
import { UnauthorizedHttpException } from '@senhung/http-exceptions'
import { compare } from 'bcrypt'
import { ObjectId } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'
import { getUserId, isUserSignedIn, signUserIn, signUserOut } from '../auth'
import { db } from '../db'

export const AuthRouter: RouterDefinition<typeof AuthApi> = {
  createSession: async req => {
    const credentials = req.body
    const user = await db.userCollection().findOne({
      $text: { $search: `"${credentials.email}"`, $caseSensitive: false }
    })
    if (user == null || !(await compare(credentials.password, user.password))) {
      throw new UnauthorizedHttpException('Invalid username or password.')
    }
    signUserIn(req, user._id || "this can't happen, fix in #59")
    delete user.password
    return {
      user,
      csrfToken: req.csrfToken()
    }
  },
  deleteSession: req => {
    signUserOut(req)
    return {
      csrfToken: req.csrfToken()
    }
  },
  getSession: async req => {
    let user: User | undefined
    if (isUserSignedIn(req)) {
      user =
        (await db.userCollection().findOne({
          _id: new ObjectId(getUserId(req))
        })) || undefined
    }
    if (user !== undefined) {
      delete user.password
    }
    return {
      user,
      csrfToken: req.csrfToken()
    }
  }
}
