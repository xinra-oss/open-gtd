import * as BodyParser from 'body-parser'
import * as express from 'express'
import * as session from 'express-session'
import { authMiddleware, sessionConfiguration } from './auth'
import { config } from './config'
import { db } from './db'
import { logger } from './logging'
import { OpenGtdRouter } from './router'

async function main() {
  logger.info('Starting server...')
  await db.connect()

  const app = express()
  app.use(BodyParser.json())
  app.use(session(sessionConfiguration))
  app.use('/api', authMiddleware)
  app.use('/api', OpenGtdRouter)

  const port = config.get('port')
  app.listen(port, () => logger.info('Server is listening on port %s', port))
}
main()
