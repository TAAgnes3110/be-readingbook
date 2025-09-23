const app = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')

// SERVER CONFIGURATION
const host = config.app.host || 'localhost'
const port = config.app.port || 3000
const prefix = config.app.prefix || ''

let server = null

// START SERVER
const startServer = () => {
  try {
    server = app.listen(port, host, () => {
      logger.info(`Server đang chạy tại http://${host}:${port}${prefix}`)
      logger.info(`Environment: ${config.env}`)
      logger.info(`Started at: ${new Date().toISOString()}`)
    })

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${port} đã được sử dụng. Vui lòng chọn port khác.`)
      } else {
        logger.error('❌ Server error:', error)
      }
      process.exit(1)
    })

  } catch (error) {
    logger.error('❌ Không thể khởi động server:', error)
    process.exit(1)
  }
}

// GRACEFUL SHUTDOWN
const gracefulShutdown = (signal) => {
  logger.info(`📴 Nhận tín hiệu ${signal}. Đang tắt server...`)

  if (server) {
    server.close((error) => {
      if (error) {
        logger.error('❌ Lỗi khi tắt server:', error)
        process.exit(1)
      } else {
        logger.info('✅ Server đã được tắt thành công')
        process.exit(0)
      }
    })

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Timeout! Force closing server...')
      process.exit(1)
    }, 10000)
  } else {
    process.exit(0)
  }
}

// ERROR HANDLERS
const handleUnexpectedError = (error) => {
  logger.error('Unexpected error:', error)
  gracefulShutdown('UNCAUGHT_EXCEPTION')
}

// PROCESS EVENT LISTENERS
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

startServer()
