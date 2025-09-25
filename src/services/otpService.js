const { otpProvider } = require('../providers/index')
const emailService = require('./emailService')
const logger = require('../config/logger')

/**
 * Send OTP to email by request type
 * @param {string} email
 * @param {'register'|'reset'|'update'} type
 * @returns {Promise<object>}
 */
async function sendOTP(email, type) {
  if (!['register', 'reset', 'update'].includes(type)) {
    logger.error(`Invalid OTP type: ${type}`)
    throw new Error('Invalid OTP type')
  }
  try {
    const otp = otpProvider.generate()
    await otpProvider.store(email, otp)
    const result = await emailService.sendOTP(email, otp, type)
    logger.info(`OTP sent to ${email} for ${type}`)
    return { success: true, message: 'OTP sent successfully', data: result }
  } catch (error) {
    logger.error(`Failed to send OTP to ${email} for ${type}: ${error.stack}`)
    throw error
  }
}

/**
 * Verify OTP
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<object>}
 */
async function verifyOTP(email, otp) {
  try {
    const result = await otpProvider.verify(email, otp)
    if (result.success) {
      logger.info(`OTP verified for ${email}`)
    } else {
      logger.warn(`OTP verification failed for ${email}: ${result.message}`)
    }
    return result
  } catch (error) {
    logger.error(`Error verifying OTP for ${email}: ${error.stack}`)
    throw error
  }
}

/**
 * Clear stored OTP
 * @param {string} email
 * @returns {Promise<void>}
 */
async function clearOTP(email) {
  try {
    await otpProvider.delete(email)
    logger.info(`Cleared OTP for ${email}`)
  } catch (error) {
    logger.error(`Failed to clear OTP for ${email}: ${error.stack}`)
    throw error
  }
}

module.exports = {
  sendOTP,
  verifyOTP,
  clearOTP
}
