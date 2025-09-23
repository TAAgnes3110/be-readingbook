const admin = require('firebase-admin')
const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const logger = require('../config/logger')
const userModel = require('../models/userModel')

const auth = admin.auth()

/**
 * Tạo user mới trong Firebase Auth
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
    logger.info(`Đã tạo người dùng Firebase Auth: ${email}`)
    return userRecord
  } catch (error) {
    logger.error(
      `Lỗi khi tạo người dùng Firebase Auth ${email}: ${error.stack}`
    )
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Không thể tạo người dùng'
    )
  }
}

/**
 * Lấy thông tin user bằng uid
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getUserById(id) {
  try {
    const user = await userModel.findById(id)
    return user
  } catch (error) {
    logger.error(`Lỗi khi lấy người dùng Firebase Auth ${id}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng')
  }
}

/**
 * Lấy thông tin user bằng email
 * @param {string} email
 * @returns {Promise<object>}
 */
async function getUserByEmail(email) {
  try {
    const user = await userModel.findByEmail(email.toLowerCase())
    return user
  } catch (error) {
    logger.error(
      `Lỗi khi lấy người dùng Firebase Auth ${email}: ${error.stack}`
    )
    throw error instanceof ApiError
      ? error
      : new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng')
  }
}

module.exports = {
  createAuthUser,
  getUserById,
  getUserByEmail
}
