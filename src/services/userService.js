const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const { hashPassword } = require('../utils/passwordUtils')
const userModel = require('../models/userModel')
const { admin } = require('../config/db')

/**
 * Get user by ID
 * @param {string} id - User ID (Firebase Auth UID)
 * @returns {Promise<Object>} - User object
 * @throws {ApiError} 404 - User not found
 */
const getUserById = async (id) => {
  try {
    if (!id)
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'User ID is required'
      )
    const user = await userModel.findById(id)
    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found')
    }
    return { _id: id, ...user }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to get user information: ${error.message}`
    )
  }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} - User object
 * @throws {ApiError} 404 - User not found
 */
const getUserByEmail = async (email) => {
  try {
    if (!email)
      throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email is required')
    const users = await userModel.findByEmail(email.trim().toLowerCase())
    if (!users) {
      throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found')
    }
    const userId = Object.keys(users)[0]
    const user = users[userId]
    if (!user.isActive) {
      throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found')
    }
    return { _id: userId, ...user }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to get user information: ${error.message}`
    )
  }
}

/**
 * Update user by ID
 * @param {string} userId - User ID
 * @param {Object} updateBody - Update data
 * @returns {Promise<Object>} - Updated user object
 * @throws {ApiError} 404 - User not found
 */
const updateUserById = async (userId, updateBody) => {
  try {
    const user = await getUserById(userId)

    // Check for duplicate email
    if (
      updateBody.email &&
      updateBody.email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      const users = await userModel.findByEmail(
        updateBody.email.trim().toLowerCase()
      )
      if (users && Object.keys(users).some((id) => id !== userId)) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email already in use')
      }

      await admin
        .auth()
        .updateUser(userId, { email: updateBody.email.trim().toLowerCase() })
    }

    // Hash password if provided
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
      customId: user.customId, // Not allowed to update
      isActive: user.isActive,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    }

    await userModel.update(userId, updatedData)
    const updatedUser = await userModel.findById(userId)
    return { _id: userId, ...updatedUser }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to update user: ${error.message}`
    )
  }
}

/**
 * Delete user by ID (soft delete)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deleted user object
 * @throws {ApiError} 404 - User not found
 */
const deleteUserById = async (userId) => {
  try {
    await getUserById(userId) // Check if exists
    await userModel.update(userId, {
      isActive: false,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    })
    const updatedUser = await userModel.findById(userId)
    return { _id: userId, ...updatedUser }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to delete user: ${error.message}`
    )
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
}
