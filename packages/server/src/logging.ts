import { createLogger, format, transports } from 'winston'
import { config } from './config'

export const logger = createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()],
  level: config.get('env') === 'production' ? 'info' : 'debug'
})
