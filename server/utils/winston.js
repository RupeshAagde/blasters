var winston = require('winston')
const conf = require('../../config')

var options = {
  console: {
    level: conf.log_level || 'info',
    handleExceptions: true,
    json: true,
    colorize: false
  }
}

const { splat, combine, timestamp, json } = winston.format

// meta param is ensured by splat()
const myFormat = json(({ timestamp, level, message, meta }) => {
  return `${timestamp} ${level} ${message} ${meta ? JSON.stringify(meta) : ''}`
})

const logger = winston.createLogger({
  format: combine(timestamp(), splat(), myFormat),
  transports: [new winston.transports.Console(options.console)]
})

module.exports = logger
