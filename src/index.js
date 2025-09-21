const app = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')

let server

const host = config.app.host || 'localhost'
const port = config.app.port || 3000
const prefix = config.app.prefix || ''

server = app.listen(port, host, () => {
  logger.info(`Server running at http://${host}:${port}${prefix}`)
})

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
