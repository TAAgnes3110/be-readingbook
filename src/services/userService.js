const admin = require('firebase-admin')
const httpStatus = require('http-status')
const { ApiError, hashPassword } = require('../utils/index')
const userModel = require('../models/userModel')

/**
 * Lấy thông tin người dùng theo ID
 * @param {string} id - ID của người dùng (Firebase Auth UID)
 * @returns {Promise<Object>} - Đối tượng người dùng
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const getUserById = async (id) => {
  try {
    if (!id)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Yêu cầu cung cấp ID người dùng'
      )
    const user = await userModel.findById(id)
    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại')
    }
    return { _id: id, ...user }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Không thể lấy thông tin người dùng: ${error.message}`
    )
  }
}

/**
 * Lấy thông tin người dùng theo email
 * @param {string} email - Email của người dùng
 * @returns {Promise<Object>} - Đối tượng người dùng
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const getUserByEmail = async (email) => {
  try {
    if (!email)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Yêu cầu cung cấp email')
    const users = await userModel.findByEmail(email.trim().toLowerCase())
    if (!users) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại')
    }
    const userId = Object.keys(users)[0]
    const user = users[userId]
    if (!user.isActive) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại')
    }
    return { _id: userId, ...user }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Không thể lấy thông tin người dùng: ${error.message}`
    )
  }
}

/**
 * Cập nhật thông tin người dùng theo ID
 * @param {string} userId - ID của người dùng
 * @param {Object} updateBody - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Đối tượng người dùng đã cập nhật
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const updateUserById = async (userId, updateBody) => {
  try {
    const user = await getUserById(userId)

    // Kiểm tra email trùng lặp
    if (
      updateBody.email &&
      updateBody.email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      const users = await userModel.findByEmail(
        updateBody.email.trim().toLowerCase()
      )
      if (users && Object.keys(users).some((id) => id !== userId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng')
      }

      await admin
        .auth()
        .updateUser(userId, { email: updateBody.email.trim().toLowerCase() })
    }

    // Hash mật khẩu nếu được cung cấp
    const hashedPassword = updateBody.password
      ? await hashPassword(updateBody.password)
      : user.password

    const updatedData = {
      email: updateBody.email
        ? updateBody.email.trim().toLowerCase()
        : user.email,
      phoneNumber: updateBody.phoneNumber
        ? updateBody.phoneNumber.trim()
        : user.phoneNumber,
      password: hashedPassword,
      fullname: updateBody.fullname
        ? updateBody.fullname.trim()
        : user.fullname,
      role: updateBody.role || user.role,
      avatar: updateBody.avatar ? updateBody.avatar.trim() : user.avatar,
      preferences: updateBody.preferences || user.preferences,
      comments: updateBody.comments || user.comments,
      history: updateBody.history || user.history,
      customId: user.customId, // Không cho phép cập nhật
      isActive: user.isActive,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    }

    await userModel.update(userId, updatedData)
    const updatedUser = await userModel.findById(userId)
    return { _id: userId, ...updatedUser }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Không thể cập nhật người dùng: ${error.message}`
    )
  }
}

/**
 * Xóa người dùng theo ID (xóa mềm)
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object>} - Đối tượng người dùng đã xóa
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const deleteUserById = async (userId) => {
  try {
    await getUserById(userId) // Kiểm tra tồn tại
    await userModel.update(userId, {
      isActive: false,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    })
    const updatedUser = await userModel.findById(userId)
    return { _id: userId, ...updatedUser }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Không thể xóa người dùng: ${error.message}`
    )
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
}
