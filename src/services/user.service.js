const admin = require('firebase-admin')
const httpStatus = require('http-status-codes')
const ApiError = require('../utils/ApiErrors')
const { hashPassword } = require('../utils/passwordUtils')
const { generateCustomId } = require('../utils/idUtils')

const db = admin.database()
const usersRef = db.ref('users')

/**
 * Tạo người dùng mới
 * @param {Object} userBody
 * @returns {Promise<Object>}
 * @throws {ApiError} 400 - Email đã được sử dụng
 */
const createUser = async (userBody) => {
  try {
    const emailSnapshot = await usersRef
      .orderByChild('email')
      .equalTo(userBody.email.trim().toLowerCase())
      .once('value')
    if (emailSnapshot.exists()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng')
    }

    const customId = await generateCustomId()

    const newUserRef = usersRef.push()
    const userId = newUserRef.key

    const userData = {
      _id: userId,
      customId,
      email: userBody.email.trim().toLowerCase(),
      password: await hashPassword(userBody.password),
      fullname: userBody.fullname.trim(),
      role: userBody.role || 'user',
      isActive: true,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
      lastLogin: admin.database.ServerValue.TIMESTAMP,
      preferences: userBody.preferences || [],
      comments: userBody.comments || [],
      history: userBody.history || [],
      avatar: userBody.avatar?.trim() || null
    }

    await newUserRef.set(userData)
    return userData
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Không thể tạo người dùng: ${error.message}`
    )
  }
}

/**
 * Lấy thông tin người dùng theo ID
 * @param {string} id
 * @returns {Promise<Object>}
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const getUserById = async (id) => {
  try {
    if (!id)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Yêu cầu cung cấp ID người dùng'
      )
    const snapshot = await usersRef.child(id).once('value')
    const user = snapshot.val()
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
    const snapshot = await usersRef
      .orderByChild('email')
      .equalTo(email.trim().toLowerCase())
      .once('value')
    const users = snapshot.val()
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
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const updateUserById = async (userId, updateBody) => {
  try {
    const user = await getUserById(userId)

    if (
      updateBody.email &&
      updateBody.email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      const snapshot = await usersRef
        .orderByChild('email')
        .equalTo(updateBody.email.trim().toLowerCase())
        .once('value')
      const existingUsers = snapshot.val()
      if (
        existingUsers &&
        Object.keys(existingUsers).some((id) => id !== userId)
      ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng')
      }
    }

    // Hash mật khẩu nếu được cung cấp
    const hashedPassword = updateBody.password
      ? await hashPassword(updateBody.password)
      : user.password

    const updatedData = {
      email: updateBody.email
        ? updateBody.email.trim().toLowerCase()
        : user.email,
      password: hashedPassword,
      fullname: updateBody.fullname
        ? updateBody.fullname.trim()
        : user.fullname,
      role: updateBody.role || user.role,
      avatar: updateBody.avatar ? updateBody.avatar.trim() : user.avatar,
      preferences: updateBody.preferences || user.preferences,
      comments: updateBody.comments || user.comments,
      history: updateBody.history || user.history,
      customId: user.customId,
      isActive: user.isActive,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    }

    await usersRef.child(userId).update(updatedData)

    // Lấy dữ liệu người dùng sau khi cập nhật
    const updatedSnapshot = await usersRef.child(userId).once('value')
    const updatedUser = updatedSnapshot.val()
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
 * Xóa người dùng theo ID
 * @param {string} userId
 * @returns {Promise<Object>}
 * @throws {ApiError} 404 - Người dùng không tồn tại
 */
const deleteUserById = async (userId) => {
  try {
    await getUserById(userId)
    await usersRef.child(userId).update({
      isActive: false,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    })
    // Lấy dữ liệu sau khi cập nhật để phản ánh trạng thái isActive
    const updatedSnapshot = await usersRef.child(userId).once('value')
    const updatedUser = updatedSnapshot.val()
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
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
}
