const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const { getUserError, getAuthError } = require('../constants/errorMessages')
const logger = require('../config/logger')
const { auth } = require('../config/db')
const config = require('../config/config')

/**
 * Create new user in Firebase Auth
 * @param {string} email
 * @param {string} password
 * @returns {Promise<admin.auth.UserRecord>}
 */
async function createAuthUser(email, password) {
  try {
    const userRecord = await auth.createUser({
      email: email.toLowerCase(),
      password
    })
    logger.info(`Created Firebase Auth user: ${email}`)
    return userRecord
  } catch (error) {
    logger.error(
      `Error creating Firebase Auth user ${email}: ${error.message}`
    )

    // Handle specific errors
    if (error.code === 'auth/email-already-exists') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        getUserError('EMAIL_ALREADY_EXISTS')
      )
    } else if (error.code === 'auth/invalid-email') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        getUserError('INVALID_EMAIL')
      )
    } else if (error.code === 'auth/weak-password') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        getUserError('PASSWORD_TOO_WEAK')
      )
    } else {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        getAuthError('TOKEN_GENERATION_FAILED')
      )
    }
  }
}

module.exports = {
  createAuthUser,
}
