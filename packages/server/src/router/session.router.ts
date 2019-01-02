import { AuthApi, UnauthorizedHttpException, UserEntity } from '@open-gtd/api'
import { compare } from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { RouterDefinition } from 'rest-ts-express'
import { getUserId, isUserSignedIn, signUserIn, signUserOut } from '../auth'
import { db } from '../db'

export const AuthRouter: RouterDefinition<typeof AuthApi> = {
  createSession: async req => {
    const emailLowerCase = req.body.email.toLowerCase()
    const credentialsInDb = await db
      .credentialsCollection()
      .findOne({ email: emailLowerCase })

    if (
      credentialsInDb === null ||
      !(await compare(req.body.password, credentialsInDb.password))
    ) {
      throw new UnauthorizedHttpException('Invalid username or password.')
    }

    const user = await db
      .userCollection()
      .findOne({ _id: new ObjectId(credentialsInDb.userId) })

    if (user === null) {
      throw new Error(
        `User for credentials with ID ${credentialsInDb._id} does not exist.`
      )
    }

    signUserIn(req, user._id)
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
    let user: UserEntity | undefined
    if (isUserSignedIn(req)) {
      user =
        (await db.userCollection().findOne({
          _id: new ObjectId(getUserId(req))
        })) || undefined
    }
    return {
      user,
      csrfToken: req.csrfToken()
    }
  }
}
