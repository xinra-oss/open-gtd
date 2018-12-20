import * as convict from 'convict'

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

config.validate()
