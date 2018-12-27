import { UnauthorizedHttpException } from '@open-gtd/api'
import { NextFunction, Request, Response } from 'express'

export const sessionConfiguration = {
  name: 'open-gtd.sid',
  resave: false,
  saveUninitialized: false,
  secret: 'DEV_SECRET'
}

export function getUserId(req: Request): string {
  if (req.session === undefined) {
    throw new Error('there is no session')
  }
  return req.session.userId
}

export function signUserIn(req: Request, userId: string) {
  if (req.session === undefined) {
    throw new Error('there is no session')
  }
  req.session.userId = userId
}

export function signUserOut(req: Request) {
  if (req.session === undefined) {
    throw new Error('there is no session')
  }
  delete req.session.userId
}

export const isUserSignedIn = (req: Request) =>
  req.session !== undefined && getUserId(req) !== undefined

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isLoginRoute = req.method === 'POST' && req.path === '/session'
  const isGetSessionRoute = req.method === 'GET' && req.path === '/session'
  const isRegisterRoute = req.method === 'POST' && req.path === '/users'
  if (isLoginRoute || isRegisterRoute || isGetSessionRoute) {
    next()
    return
  }
  if (isUserSignedIn(req)) {
    next()
  } else {
    throw new UnauthorizedHttpException()
  }
}
