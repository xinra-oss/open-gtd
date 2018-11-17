import * as BodyParser from 'body-parser'
import * as express from 'express'
import { OpenGtdRouter } from './router'

const app = express()

app.use(BodyParser.json())
app.use('/api', OpenGtdRouter)

app.listen(3001)
