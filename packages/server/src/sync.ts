import { AppSyncEvent } from '@open-gtd/api'
import { Express, Request } from 'express'
import * as expressWs from 'express-ws'
import WebSocket from 'ws'
import { getUserId, getUserIdFromSession } from './auth'
import { logger } from './logging'

let expressWsInstance: expressWs.Instance | undefined

export const sync = {
  startServer: (app: Express, path: string) => {
    logger.info('Starting sync server at %s', path)
    expressWsInstance = expressWs(app)

    expressWsInstance.app.ws(path, (ws, req) => {
      logger.debug('Client connected to sync server', req.session)
      attachSessionToWebSocketClient(ws, req)
    })
  },
  push: (syncEvent: AppSyncEvent, soureReq: Request) => {
    if (expressWsInstance === undefined) {
      return
    }
    if (soureReq.session === undefined) {
      throw new Error('there is no session')
    }
    const sourceSessionId = soureReq.session.id
    const sourceUserId = getUserId(soureReq)

    // NOTE: This only works for clients on this node! For cluster support we
    // need to add additional synchronization.
    expressWsInstance.getWss().clients.forEach(client => {
      const clientSession = getAttachedSession(client)
      const clientUserId = getUserIdFromSession(clientSession)
      if (
        sourceUserId === clientUserId &&
        sourceSessionId !== clientSession.id
      ) {
        client.send(JSON.stringify(syncEvent))
      }
    })
  }
}

function attachSessionToWebSocketClient(client: WebSocket, req: Request) {
  // tslint:disable-next-line
  client['__session'] = req.session
}

function getAttachedSession(client: WebSocket): Express.Session {
  // tslint:disable-next-line
  return client['__session']
}
