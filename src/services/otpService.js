const { otpProvider } = require('../providers/index')
const emailService = require('./emailService')
const logger = require('../config/logger')

/**
 * Gửi OTP đến email theo loại yêu cầu
 * @param {string} email
 * @param {'register'|'reset'|'update'} type
 * @returns {Promise<object>}
 */
const sendOTP = async (data) => {
  const { email, type } = data
  // Kiểm tra loại OTP hợp lệ
  if (!['register', 'reset', 'update'].includes(type)) {
    logger.error(`Invalid OTP type: ${type}`)
    throw new Error('Loại OTP không hợp lệ')
  }

  try {
    // Tạo và lưu trữ OTP
    const otp = otpProvider.generate()
    await otpProvider.store(email, otp)

    // Gửi OTP qua email
    const result = await emailService.sendOTP({ email, otp, type })
    logger.info(`OTP sent to ${email} for ${type}`)

    return { success: true, message: 'OTP đã được gửi thành công', data: result }
  } catch (error) {
    logger.error(`Failed to send OTP to ${email} for ${type}: ${error.stack}`)
    throw error
  }
}

/**
 * Xác thực OTP
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<object>}
 */
const verifyOTP = async (data) => {
  const { email, otp } = data
  try {
    // Xác thực OTP
    const result = await otpProvider.verify(email, otp)

    if (result.success) {
      logger.info(`OTP verified for ${email}`)
    } else {
      logger.warn(`OTP verification failed for ${email}: ${result.message}`)
    }

    return result
  } catch (error) {
    logger.error(`Error verifying OTP for ${email}: ${error.stack}`)
    return { success: false, message: 'Lỗi xác thực OTP' }
  }
}

/**
 * Xóa OTP đã lưu trữ
 * @param {string} email
 * @returns {Promise<void>}
 */
const clearOTP = async (data) => {
  const { email } = data
  try {
    // Xóa OTP khỏi database
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
