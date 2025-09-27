const httpStatus = require('http-status')
const logger = require('../config/logger')
const { ApiError } = require('../utils/index')
const { otpService, firebaseService, tokenService } = require('../services/index')
const { comparePassword } = require('../utils/passwordUtils')
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
        // Other error or email already exists
        throw error
      }
    }

    // Create user in Firebase Auth
    await firebaseService.createAuthUser(userData.email, userData.password)

    // Create user in Realtime Database
    const { userId: createdUserId, message } = await userModel.create(userData)

    // Send OTP
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
    await userModel.findByEmailForActivation(email)

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

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login result with user data and tokens
 * @throws {ApiError} - If login fails
 */
async function login(email, password) {
  try {
    let user
    try {
      user = await userModel.findByEmail(email)
    } catch (error) {
      if (error.statusCode === httpStatus.status.NOT_FOUND) {
        throw new ApiError(
          httpStatus.status.UNAUTHORIZED,
          'Email hoặc mật khẩu không đúng'
        )
      }
      throw error
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        'Email hoặc mật khẩu không đúng'
      )
    }

    const accessToken = tokenService.generateAccessToken(user._id, user.role)
    const refreshToken = tokenService.generateRefreshToken(user._id)

    await userModel.update(user._id, {
      isOnline: true,
      lastLogin: Date.now()
    })

    const { password: userPassword, ...userWithoutPassword } = user

    logger.info(`User ${user._id} logged in successfully`)

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      message: 'Login successful'
    }
  } catch (error) {
    logger.error(`Error logging in user ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Login failed: ${error.message}`
      )
  }
}

module.exports = {
  SignUp,
  verifyAndActivateUser,
  resendOTP,
  login
}
