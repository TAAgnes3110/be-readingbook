const httpStatus = require('http-status')
const logger = require('../config/logger')
const { ApiError } = require('../utils/index')
const { otpService, tokenService } = require('../services/index')
const userModel = require('../models/userModel')

/**
 * Register new user
 * @param {Object} userBody - User data
 * @returns {Promise<Object>} - User ID and message
 * @throws {ApiError} - If registration fails
 */
async function SignUp(userBody) {
  try {
    const {
      email,
      password,
      confirmPassword,
      fullName,
      phoneNumber,
      role = 'user',
      _id,
      userId
    } = userBody
    const userData = {
      email,
      password,
      confirmPassword,
      fullName,
      phoneNumber,
      role,
      _id,
      userId
    }

    try {
      await userModel.findByEmailForActivation(userData.email)
      // If user found, email already exists
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Email already in use'
      )
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === httpStatus.status.NOT_FOUND) {
        // Email does not exist, continue
      } else {
        throw error
      }
    }

    const { userId: createdUserId, message } = await userModel.create(userData)

    await otpService.sendOTP(userData.email, 'register')

    return { userId: createdUserId, message }
  } catch (error) {
    logger.error(`Error registering user: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Registration failed: ${error.message}`
      )
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login result
 * @throws {ApiError} - If login fails
 */
async function login(email, password) {
  try {
    const user = await userModel.verifyPassword(email, password)

    await userModel.update(user._id, {
      lastLogin: Date.now(),
      isOnline: true
    })

    const accessToken = tokenService.generateAccessToken(user._id, user.role)
    const refreshToken = tokenService.generateRefreshToken(user._id)
    const firebaseToken = await tokenService.generateFirebaseCustomToken(user._id, {
      role: user.role
    })

    const { password: userPassword, ...userWithoutPassword } = user

    logger.info(`User ${email} logged in successfully`)

    return {
      user: userWithoutPassword,
      token: {
        access: accessToken,
        refresh: refreshToken,
        firebase: firebaseToken
      }
    }
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Login failed: ${error.message}`
      )
  }
}

/**
 * Verify OTP and activate user
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - Verification result
 * @throws {ApiError} - If verification fails
 */
async function verifyAndActivateUser(email, otp) {
  try {
    const otpResult = await otpService.verifyOTP(email, otp)
    if (!otpResult.success) {
      throw new ApiError(httpStatus.status.BAD_REQUEST, otpResult.message)
    }

    // Find userId from email (without checking isActive)
    const user = await userModel.findByEmailForActivation(email)
    const userId = user._id
    await userModel.activateUser(userId)
    await otpService.clearOTP(email)
    return { success: true, message: 'Account activated successfully' }
  } catch (error) {
    logger.error(`Error verifying OTP for ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `OTP verification failed: ${error.message}`
      )
  }
}

/**
 * Resend OTP
 * @param {string} email - User email
 * @returns {Promise<Object>} - OTP sending result
 * @throws {ApiError} - If sending fails
 */
async function resendOTP(email) {
  try {
    // Check if user exists
    await userModel.findByEmailForActivation(email)

    // Send new OTP
    await otpService.sendOTP(email, 'register')

    return { message: 'OTP resent successfully' }
  } catch (error) {
    logger.error(`Error resending OTP for ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Failed to resend OTP: ${error.message}`
      )
  }
}


module.exports = {
  SignUp,
  login,
  verifyAndActivateUser,
  resendOTP
}
