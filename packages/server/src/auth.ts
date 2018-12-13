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

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    (req.path === '/session' || req.path === '/users') &&
    req.method === 'POST'
  ) {
    next() // allow login and register
    return
  }
  if (req.session !== undefined && getUserId(req) !== undefined) {
    next()
  } else {
    res.sendStatus(401)
  }
}
