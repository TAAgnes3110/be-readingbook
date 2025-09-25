const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const { tokenService } = require('../services/index')
const logger = require('../config/logger')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        'Valid token is required'
      )
    }
    const token = authHeader.split(' ')[1]
    const payload = await tokenService.verifyAuthToken(token)
    req.userId = payload.userId
    next()
  } catch (error) {
    logger.error(`Token authentication error: ${error.stack}`)
    next(
      error instanceof ApiError
        ? error
        : new ApiError(httpStatus.status.UNAUTHORIZED, 'Invalid token')
    )
  }
}

module.exports = authMiddleware
