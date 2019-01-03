import * as convict from 'convict'
import * as fs from 'fs'

export const config = convict({
  db: {
    host: {
      default: 'localhost',
      format: '*'
    },
    embedded: {
      default: true,
      doc:
        'If set to true, a dynamically created embedded database is used in development and test environment.',
      format: Boolean
    },
    name: {
      default: 'open-gtd',
      format: String
    },
    port: {
      default: 27017,
      format: 'port'
    }
  },
  env: {
    default: 'development',
    env: 'NODE_ENV',
    format: ['production', 'development', 'test']
  },
  port: {
    default: 3001,
    format: 'port'
  }
})

const localConfigFile = process.cwd() + '/config.local.json'
if (fs.existsSync(localConfigFile)) {
  // Cannot use logger here because it depends on config
  // tslint:disable-next-line
  console.info('Using local configuration file ' + localConfigFile)
  config.loadFile(localConfigFile)
}

config.validate()
