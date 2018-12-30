import * as BodyParser from 'body-parser'
import * as cors from 'cors'
import * as csrf from 'csurf'
import * as express from 'express'
import * as session from 'express-session'
import { authMiddleware, sessionConfiguration } from './auth'
import { config } from './config'
import { db } from './db'
import {
  handleNonHttpExceptions,
  returnTypedHttpException
} from './errorhandling'
import { logger } from './logging'
import { OpenGtdRouter } from './router'
import { sync } from './sync'

async function main() {
  logger.info('Starting server...')

  await db.connect()
  const app = express()

  app.use(
    cors({
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'DELETE'],
      credentials: true
    })
  )
  app.use(BodyParser.json())
  app.use(session(sessionConfiguration))
  app.use(csrf())
  app.use('/api', authMiddleware)
  app.use('/api', OpenGtdRouter)

  app.use(handleNonHttpExceptions)
  app.use(returnTypedHttpException)

  sync.startServer(app, '/sync')

  const port = config.get('port')
  app.listen(port, () => logger.info('Server is listening on port %s', port))
}
main()
