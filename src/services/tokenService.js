const jwt = require('jsonwebtoken')
const NodeCache = require('node-cache')
const config = require('../config/config')
const logger = require('../config/logger')
const { auth } = require('../config/db')

const refreshTokenCache = new NodeCache({ stdTTL: config.cache.ttl })

/**
 * Generate access token
 * @param {string} userId
 * @param {string} role
 * @returns {string}
 */
function generateAccessToken(userId, role) {
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
function generateRefreshToken(userId) {
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
async function generateFirebaseCustomToken(userId, additionalClaims = {}) {
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
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    logger.info(`Verified token for user ${decoded.sub}`)
    return decoded
  } catch (error) {
    logger.error(`Token verification failed: ${error.stack}`)
    return null
  }
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
async function refresh(refreshToken) {
  try {
    const decoded = verifyToken(refreshToken)
    if (!decoded) {
      logger.warn('Invalid refresh token')
      throw new Error('Invalid refresh token')
    }
    const cached = refreshTokenCache.get(`refresh:${decoded.sub}`)
    if (cached !== refreshToken) {
      logger.warn(`Refresh token mismatch for user ${decoded.sub}`)
      throw new Error('Invalid refresh token')
    }
    const newAccessToken = generateAccessToken(decoded.sub, 'user')
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
function revoke(userId) {
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
