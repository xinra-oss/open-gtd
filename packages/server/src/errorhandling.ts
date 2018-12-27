import {
  BadRequestHttpException,
  ForbiddenHttpException,
  HttpException,
  InternalServerErrorHttpException,
  TypedHttpException
} from '@open-gtd/api'
import { BadRequestHttpException as RestTsExpressBadRequestHttpException } from '@senhung/http-exceptions'
import { ErrorRequestHandler } from 'express'
import { logger } from './logging'

export const handleNonHttpExceptions: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err) {
    if (err instanceof RestTsExpressBadRequestHttpException) {
      // This is the same class but we need the one exported by @open-gtd/api
      // for `instanceof` to work correctly
      Object.setPrototypeOf(err, BadRequestHttpException.prototype)
      next(err)
    } else if (err.code === 'EBADCSRFTOKEN') {
      next(new ForbiddenHttpException(err.message))
    } else if (err instanceof HttpException) {
      next(err)
    } else {
      logger.error('UNCAUGHT EXCEPTION: %O', err)
      next(new InternalServerErrorHttpException())
    }
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
