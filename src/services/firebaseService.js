const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const logger = require('../config/logger')
const { auth } = require('../config/db')

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
        'Email đã được sử dụng'
      )
    } else if (error.code === 'auth/invalid-email') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Email không hợp lệ'
      )
    } else if (error.code === 'auth/weak-password') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'Mật khẩu quá yếu'
      )
    } else {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        'Không thể tạo người dùng'
      )
    }
  }
}

/**
 * Update Firebase Auth user password
 * @param {string} email
 * @param {string} newPassword
 * @returns {Promise<admin.auth.UserRecord>}
 */
async function updateAuthUserPassword (email, newPassword) {
  try {
    // Tìm user trong Firebase Auth bằng email
    const userRecord = await auth.getUserByEmail(email)

    // Cập nhật password trong Firebase Auth
    await auth.updateUser(userRecord.uid, { password: newPassword })

    return true
  } catch (error) {
    logger.error(`Error updating Firebase Auth user password for ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Cập nhật mật khẩu Firebase Auth thất bại: ${error.message}`
      )
  }
}

module.exports = {
  createAuthUser,
  updateAuthUserPassword
}
