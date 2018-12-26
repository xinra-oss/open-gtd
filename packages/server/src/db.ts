import { Context, Task, User } from '@open-gtd/api'
import { Db, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { config } from './config'
import { logger } from './logging'

let mongoClient: MongoClient | undefined
let mongoDb: Db | undefined
let memoryServer: MongoMemoryServer | undefined

export const db = {
  connect: async () => {
    if (mongoClient !== undefined) {
      throw new Error('db already connected')
    }
    const env = config.get('env')
    if (config.get('db').embedded === true && env !== 'production') {
      logger.info(
        'Creating embedded database because db.embedded=true and env=%s',
        env
      )
      memoryServer = new MongoMemoryServer({
        instance: {
          dbName: config.get('db').name
        }
      })
      config.set('db.host', 'localhost')
      config.set('db.port', await memoryServer.getPort())
      logger.info('Saving data to %s', await memoryServer.getDbPath())
    }
    const uri = `mongodb://${config.get('db').host}:${config.get('db').port}/`
    logger.info('Connecting to database %s', uri)
    mongoClient = await MongoClient.connect(
      uri,
      {
        useNewUrlParser: true
      }
    )
    mongoDb = mongoClient.db(config.get('db').name)
  },
  disconnect: async () => {
    if (mongoClient !== undefined) {
      await mongoClient.close()
      mongoClient = undefined
    }
    mongoDb = (undefined as unknown) as Db
    if (memoryServer !== undefined) {
      await memoryServer.stop()
      memoryServer = undefined
    }
  },
  taskCollection: () => getCollection<Task>('tasks'),
  userCollection: () => getCollection<User>('users'),
  contextCollection: () => getCollection<Context>('contexts')
}

function getCollection<T>(name: string) {
  if (mongoDb === undefined) {
    throw new Error('db is not connected')
  }
  const coll = mongoDb.collection<T>(name)
  if (name === 'users') {
    coll.createIndex({ email: 'text' })
  }
  return coll
}
