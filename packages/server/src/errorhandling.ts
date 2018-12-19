import {
  HttpException,
  InternalServerErrorHttpException,
  TypedHttpException,
  UnprocessableEntityHttpException,
  ValidationException
} from '@open-gtd/api'
import { ErrorRequestHandler } from 'express'
import { logger } from './logging'

export const handleNonHttpExceptions: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  logger.info('%O', err instanceof HttpException)
  logger.info('%O', err instanceof UnprocessableEntityHttpException)
  logger.info('%O', err instanceof ValidationException)
  if (err instanceof HttpException) {
    next(err)
  } else {
    logger.error('UNCAUGHT EXCEPTION: %O', err)
    next(new InternalServerErrorHttpException())
  }
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
      message: httpException.getMessage(),
      type: httpException.constructor.name
    }
    res.send(typedException)
  } else {
    next(err)
  }
}
