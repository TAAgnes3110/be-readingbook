const httpStatus = require('http-status')
const logger = require('../config/logger')
const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: async (req) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
    return {
      success: false,
      message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút'
    }
  },
  statusCode: httpStatus.TOO_MANY_REQUESTS
})

module.exports = rateLimiter

