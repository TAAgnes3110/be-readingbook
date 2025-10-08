const jwt = require('jsonwebtoken')
const NodeCache = require('node-cache')
const config = require('../config/config')
const logger = require('../config/logger')
const { auth } = require('../config/db')

// Initialize cache with safe default
let refreshTokenCache
try {
  refreshTokenCache = new NodeCache({
    stdTTL: (config && config.cache && config.cache.ttl) || 300 // 5 minutes default
  })
} catch (error) {
  // Fallback if config is not available
  refreshTokenCache = new NodeCache({ stdTTL: 300 })
}

/**
 * Generate access token
 * @param {string} userId
 * @param {string} role
 * @returns {string}
 */
const generateAccessToken = (data) => {
  const { userId, role } = data
  try {
    const token = jwt.sign({ sub: userId, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiry
    })
    logger.info(`Generated access token for user ${userId}`)
    return token
  } catch (error) {
    logger.error(
      `Failed to generate access token for user ${userId}: ${error.stack}`
    )
    throw error
  }
}

/**
 * Generate refresh token
 * @param {string} userId
 * @returns {string}
 */
const generateRefreshToken = (data) => {
  const { userId } = data
  try {
    const refreshToken = jwt.sign({ sub: userId }, config.jwt.secret, {
      expiresIn: '30d'
    })
    refreshTokenCache.set(`refresh:${userId}`, refreshToken)
    logger.info(`Generated refresh token for user ${userId}`)
    return refreshToken
  } catch (error) {
    logger.error(
      `Failed to generate refresh token for user ${userId}: ${error.stack}`
    )
    throw error
  }
}

/**
 * Generate Firebase custom token
 * @param {string} userId
 * @param {object} additionalClaims
 * @returns {Promise<string>}
 */
const generateFirebaseCustomToken = async (data) => {
  const { userId, additionalClaims = {} } = data
  try {
    const token = await auth
      .createCustomToken(userId, additionalClaims)
    logger.info(`Generated Firebase custom token for user ${userId}`)
    return token
  } catch (error) {
    logger.error(
      `Failed to generate Firebase custom token for user ${userId}: ${error.stack}`
    )
    throw error
  }
}

/**
 * Verify JWT token
 * @param {string} token
 * @returns {object|null}
 */
const verifyToken = (data) => {
  const { token } = data
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    logger.info(`Verified token for user ${decoded.sub}`)
    return decoded
  } catch (error) {
    logger.error(`Token verification failed: ${error.stack}`)
    throw new Error('Invalid token')
  }
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
const refresh = async (data) => {
  const { refreshToken } = data
  try {
    const decoded = verifyToken({ token: refreshToken })
    if (!decoded) {
      logger.warn('Invalid refresh token')
      throw new Error('Invalid refresh token')
    }
    const cached = refreshTokenCache.get(`refresh:${decoded.sub}`)
    if (cached !== refreshToken) {
      logger.warn(`Refresh token mismatch for user ${decoded.sub}`)
      throw new Error('Invalid refresh token')
    }
    const newAccessToken = generateAccessToken({ userId: decoded.sub, role: 'user' })
    logger.info(`Refreshed tokens for user ${decoded.sub}`)
    return { accessToken: newAccessToken, refreshToken }
  } catch (error) {
    logger.error(`Failed to refresh token: ${error.stack}`)
    throw error
  }
}

/**
 * Revoke refresh token
 * @param {string} userId
 */
const revoke = (data) => {
  const { userId } = data
  try {
    refreshTokenCache.del(`refresh:${userId}`)
    logger.info(`Revoked refresh token for user ${userId}`)
  } catch (error) {
    logger.error(
      `Failed to revoke refresh token for user ${userId}: ${error.stack}`
    )
    throw error
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateFirebaseCustomToken,
  verifyToken,
  refresh,
  revoke
}
