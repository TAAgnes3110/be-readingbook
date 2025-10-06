const app = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')

// SERVER CONFIGURATION
const host = config.render.isRender ? '0.0.0.0' : (config.app.host || 'localhost')
const port = config.render.port || config.app.port || 3000
const prefix = config.app.prefix || ''

let server = null

// START SERVER
const startServer = () => {
  try {
    server = app.listen(port, host, () => {
      const serverUrl = config.render.isRender 
        ? `https://${config.render.host}` 
        : `http://${host}:${port}${prefix}`
      
      logger.info(`Server running at ${serverUrl}`)
      logger.info(`Environment: ${config.env}`)
      logger.info(`Deployment: ${config.render.isRender ? 'Render' : 'Local'}`)
      logger.info(`Started at: ${new Date().toISOString()}`)
    })

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${port} is already in use. Please choose a different port.`)
      } else {
        logger.error('❌ Server error:', error)
      }
      process.exit(1)
    })

  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// GRACEFUL SHUTDOWN
const gracefulShutdown = (signal) => {
  logger.info(`📴 Received signal ${signal}. Shutting down server...`)

  if (server) {
    server.close((error) => {
      if (error) {
        logger.error('❌ Error shutting down server:', error)
        process.exit(1)
      } else {
        logger.info('✅ Server shut down successfully')
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
