const db = require('../config/db.js')
const { createAuthUser } = require('../services/firebaseService.js')
const { sendOTP } = require('../services/otpService.js')
const { hashPassword, ApiError } = require('../utils/index')
const httpStatus = require('http-status')
const { v4: uuidv4 } = require('uuid')

const userModel = {
  /**
   * Tạo người dùng mới
   * @param {Object} userData - Dữ liệu người dùng
   * @returns {Promise<Object>} - ID người dùng và thông báo
   * @throws {ApiError} - Nếu dữ liệu không hợp lệ hoặc tạo thất bại
   */
  create: async (userData) => {
    try {
      if (
        !userData.email ||
        !userData.password ||
        !userData.fullname ||
        !userData.phonenumber ||
        !userData.confirmpassword
      ) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Yêu cầu cung cấp email, mật khẩu, xác nhận mật khẩu, họ tên và số điện thoại'
        )
      }

      // Kiểm tra confirmpassword khớp với password
      if (userData.password !== userData.confirmpassword) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Mật khẩu xác nhận không khớp'
        )
      }

      // Kiểm tra email trùng lặp
      const emailSnapshot = await db
        .getRef('users')
        .orderByChild('email')
        .equalTo(userData.email.trim().toLowerCase())
        .once('value')
      if (emailSnapshot.val()) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng')
      }

      // Kiểm tra định dạng số điện thoại
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(userData.phonenumber.trim())) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Số điện thoại không hợp lệ'
        )
      }

      const sanitizedData = {
        customId: uuidv4(), // Tự sinh customId
        fullname: userData.fullname.trim(),
        email: userData.email.trim().toLowerCase(),
        phonenumber: userData.phonenumber.trim(),
        password: await hashPassword(userData.password),
        avatar: userData.avatar?.trim() || '',
        preferences: Array.isArray(userData.preferences)
          ? userData.preferences
          : [],
        isActive: false,
        isOnline: false,
        lastSeen: Date.now(),
        role: userData.role?.trim() || 'user',
        token: userData.token || null,
        comments: [],
        history: [],
        lastLogin: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      await createAuthUser(sanitizedData.email, userData.password)

      const userRef = db.getRef('users')
      const newUserRef = userRef.push()
      const userId = newUserRef.key
      await newUserRef.set({ _id: userId, ...sanitizedData })

      await sendOTP(sanitizedData.email, 'register')

      return {
        userId,
        message: 'Người dùng đã được tạo, vui lòng xác minh OTP'
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Không thể tạo người dùng: ${error.message}`
        )
    }
  },

  /**
   * Tìm người dùng theo ID
   * @param {string} userId - ID của người dùng
   * @returns {Promise<Object>} - Đối tượng người dùng
   * @throws {ApiError} - Nếu người dùng không tồn tại hoặc không hoạt động
   */
  findById: async (userId) => {
    try {
      if (!userId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Yêu cầu cung cấp ID người dùng'
        )
      }
      const snapshot = await db.getRef(`users/${userId}`).once('value')
      const user = snapshot.val()
      if (!user || !user.isActive) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Người dùng không tồn tại hoặc chưa kích hoạt'
        )
      }
      return { _id: userId, ...user }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Không thể lấy thông tin người dùng: ${error.message}`
        )
    }
  },

  /**
   * Tìm người dùng theo email
   * @param {string} email - Email của người dùng
   * @returns {Promise<Object>} - Đối tượng người dùng
   * @throws {ApiError} - Nếu người dùng không tồn tại hoặc không hoạt động
   */
  findByEmail: async (email) => {
    try {
      if (!email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Yêu cầu cung cấp email')
      }
      const snapshot = await db
        .getRef('users')
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
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Người dùng không tồn tại hoặc chưa kích hoạt'
        )
      }
      return { _id: userId, ...user }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Không thể lấy thông tin người dùng: ${error.message}`
        )
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {string} userId - ID của người dùng
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<boolean>} - Trạng thái cập nhật
   * @throws {ApiError} - Nếu cập nhật thất bại
   */
  update: async (userId, updateData) => {
    try {
      if (!userId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Yêu cầu cung cấp ID người dùng'
        )
      }
      const sanitizedUpdateData = {
        ...updateData,
        email: updateData.email
          ? updateData.email.trim().toLowerCase()
          : undefined,
        fullname: updateData.fullname ? updateData.fullname.trim() : undefined,
        phonenumber: updateData.phonenumber
          ? updateData.phonenumber.trim()
          : undefined,
        avatar: updateData.avatar ? updateData.avatar.trim() : undefined,
        isOnline:
          updateData.isOnline !== undefined ? updateData.isOnline : undefined,
        lastSeen: updateData.lastSeen || Date.now(),
        updatedAt: Date.now()
      }
      // Kiểm tra định dạng số điện thoại nếu được cập nhật
      if (sanitizedUpdateData.phonenumber) {
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(sanitizedUpdateData.phonenumber)) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Số điện thoại không hợp lệ'
          )
        }
      }
      await db.getRef(`users/${userId}`).update(sanitizedUpdateData)
      return true
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Không thể cập nhật người dùng: ${error.message}`
        )
    }
  },

  /**
   * Kích hoạt người dùng sau khi xác minh OTP
   * @param {string} userId - ID của người dùng
   * @returns {Promise<boolean>} - Trạng thái kích hoạt
   * @throws {ApiError} - Nếu kích hoạt thất bại
   */
  activateUser: async (userId) => {
    try {
      if (!userId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Yêu cầu cung cấp ID người dùng'
        )
      }
      await db.getRef(`users/${userId}`).update({
        isActive: true,
        updatedAt: Date.now()
      })
      return true
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Không thể kích hoạt người dùng: ${error.message}`
        )
    }
  }
}

module.exports = userModel
