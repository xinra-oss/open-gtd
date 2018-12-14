import { RouterDefinition } from 'rest-ts-express'
import { AuthApi } from '@open-gtd/api'
import { signUserIn, signUserOut } from '../auth'

export const AuthRouter: RouterDefinition<typeof AuthApi> = {
  createSession: async (req, res) => {
    const credentials = req.body
    if (credentials) {
      // TODO: actually verify credentials
      const userId = 'TODO'
      signUserIn(req, userId)
      res.sendStatus(200)
    } else {
      res.sendStatus(401)
    }
  },
  deleteSession: (req, res) => {
    signUserOut(req)
    res.sendStatus(200)
  }
}
