import { AuthApi, EmptyResponse } from '@open-gtd/api'
import { UnauthorizedHttpException } from '@senhung/http-exceptions'
import { RouterDefinition } from 'rest-ts-express'
import { signUserIn, signUserOut } from '../auth'

export const AuthRouter: RouterDefinition<typeof AuthApi> = {
  createSession: async (req, res) => {
    const credentials = req.body
    if (credentials) {
      // TODO: actually verify credentials
      const userId = 'TODO'
      signUserIn(req, userId)
      return {
        _id: userId,
        ...credentials
      }
    } else {
      throw new UnauthorizedHttpException('Invalid username or password.')
    }
  },
  deleteSession: (req, res) => {
    signUserOut(req)
    return EmptyResponse
  }
}
