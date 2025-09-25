const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
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
        'Email already in use'
      )
    } else if (error.code === 'auth/invalid-email') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Invalid email'
      )
    } else if (error.code === 'auth/weak-password') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Password too weak'
      )
    } else {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        'Unable to create user'
      )
    }
  }
}

/**
 * Verify user credentials with Firebase Auth
 * @param {string} email
 * @param {string} password
 * @returns {Promise<admin.auth.UserRecord>}
 */
async function verifyUserCredentials(email, password) {
  try {
    // Validate input parameters
    if (!email || !password) {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Email and password are required'
      )
    }

    if (typeof password !== 'string' || password.trim().length === 0) {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Password must be a non-empty string'
      )
    }

    // Get user by email to check if user exists in Firebase Auth
    let userRecord
    try {
      userRecord = await auth.getUserByEmail(email.toLowerCase())
    } catch (error) {
      throw new ApiError(
        httpStatus.status.NOT_FOUND,
        'User not found in authentication system'
      )
    }

    // Verify password using Firebase REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.firebase.webApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: password,
          returnSecureToken: true
        })
      })

    const data = await response.json()

    if (!response.ok) {
      if (data.error?.message === 'INVALID_PASSWORD') {
        throw new ApiError(
          httpStatus.status.UNAUTHORIZED,
          'Invalid password'
        )
      } else if (data.error?.message === 'EMAIL_NOT_FOUND') {
        throw new ApiError(
          httpStatus.status.NOT_FOUND,
          'User not found'
        )
      } else if (data.error?.message === 'USER_DISABLED') {
        throw new ApiError(
          httpStatus.status.FORBIDDEN,
          'User account is disabled'
        )
      } else if (data.error?.message === 'INVALID_EMAIL') {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'Invalid email format'
        )
      } else if (data.error?.message === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        throw new ApiError(
          httpStatus.status.TOO_MANY_REQUESTS,
          'Too many failed attempts. Please try again later'
        )
      } else {
        throw new ApiError(
          httpStatus.status.UNAUTHORIZED,
          `Authentication failed: ${data.error?.message || 'Unknown error'}`
        )
      }
    }

    logger.info(`Successfully verified credentials for user: ${email}`)
    return userRecord
  } catch (error) {
    logger.error(`Error verifying credentials for ${email}: ${error.message}`)

    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      'Authentication failed'
    )
  }
}

module.exports = {
  createAuthUser,
  verifyUserCredentials
}
