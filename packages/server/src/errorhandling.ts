import { TypedHttpException } from '@open-gtd/api'
import {
  HttpException,
  InternalServerErrorHttpException
} from '@senhung/http-exceptions'
import { ErrorRequestHandler } from 'express'
import { logger } from './logging'

export const handleNonHttpExceptions: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof HttpException) {
    next(err)
  }
  logger.error('UNCAUGHT EXCEPTION: %O', err)
  next(new InternalServerErrorHttpException())
}

export const returnTypedHttpException: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof HttpException) {
    const httpException = err as HttpException
    res.status(httpException.statusCode)
    const typedException: TypedHttpException = {
      ...httpException,
      type: httpException.constructor.name
    }
    res.send(typedException)
  } else {
    next(err)
  }
}
