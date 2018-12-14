import * as BodyParser from 'body-parser'
import * as express from 'express'
import * as session from 'express-session'
import { authMiddleware, sessionConfiguration } from './auth'
import { OpenGtdRouter } from './router'

const app = express()
app.use(BodyParser.json())
app.use(session(sessionConfiguration))
app.use('/api', authMiddleware)
app.use('/api', OpenGtdRouter)

app.listen(3001)
