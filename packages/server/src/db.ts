import { Context, Entity, Task, User } from '@open-gtd/api'
import debug from 'debug'
import { Db, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { config } from './config'

export type DbEntity<T extends Entity> = T & {
  _id?: string | null
}

const log = debug('db')
let mongoClient: MongoClient | undefined
let mongoDb: Db | undefined
let memoryServer: MongoMemoryServer | undefined

export const db = {
  connect: async () => {
    if (mongoClient !== undefined) {
      throw new Error('db already connected')
    }
    const env = config.get('env')
    if (config.get('db').inmemory === true && env !== 'production') {
      log(
        'Creating in-memory database because db.inmemory=true and env=%s',
        env
      )
      memoryServer = new MongoMemoryServer({
        instance: {
          dbName: config.get('db').name
        }
      })
      config.set('db.host', 'localhost')
      config.set('db.port', await memoryServer.getPort())
      log('Saving data to %s', await memoryServer.getDbPath())
    }
    const uri = `mongodb://${config.get('db').host}:${config.get('db').port}/`
    log('Connecting to %s', uri)
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
  taskCollection: () => getCollection<DbEntity<Task>>('tasks'),
  userCollection: () => getCollection<DbEntity<User>>('users'),
  contextCollection: () => getCollection<DbEntity<Context>>('contexts')
}

function getCollection<T>(name: string) {
  if (mongoDb === undefined) {
    throw new Error('db is not connected')
  }
  return mongoDb.collection<T>(name)
}
