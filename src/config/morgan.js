const morgan = require('morgan')
const logger = require('./logger')

morgan.token('message', (req, res) => res.locals.errorMessage || '')

morgan.token('client-ip', (req) => req.headers['x-forwarded-for'] || req.ip)

/**
 * Format cho log thành công (status < 400)
 */
const successResponseFormat =
  ':client-ip - :method :url :status - :response-time ms'

/**
 * Format cho log lỗi (status >= 400)
 */
const errorResponseFormat =
  ':client-ip - :method :url :status - :response-time ms - message: :message'

/**
 * Middleware log request thành công
 */
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) }
})

/**
 * Middleware log request lỗi
 */
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) }
})

module.exports = {
  successHandler,
  errorHandler
}
