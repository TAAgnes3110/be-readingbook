const db = require('../config/db.js')
const { ApiError } = require('../utils/index')
const { hashPassword } = require('../utils/passwordUtils')
const { generateCustomId } = require('../utils/idUtils')
const httpStatus = require('http-status')

const userModel = {
  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - User ID and message
   * @throws {ApiError} - If data is invalid or creation fails
   */
  create: async (userData) => {
    try {
      if (
        !userData.email ||
        !userData.password ||
        !userData.fullName ||
        !userData.phoneNumber ||
        !userData.confirmPassword
      ) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'Email, password, confirm password, full name and phone number are required'
        )
      }

      // Handle custom ID if provided
      let userId = userData._id || userData.userId
      if (userId) {
        // Check if ID already exists
        const existingUser = await db.getRef(`users/${userId}`).once('value')
        if (existingUser.val()) {
          throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            'User ID already exists'
          )
        }

        // Validate custom ID format (numeric only)
        if (isNaN(userId) || userId <= 0) {
          throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            'User ID must be a positive integer'
          )
        }

        // Convert to number
        userId = parseInt(userId)
      }

      // Check if confirmPassword matches password
      if (userData.password !== userData.confirmPassword) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'Password confirmation does not match'
        )
      }

      // Email duplicate check already done in authService

      // Check phone number format
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(userData.phoneNumber.trim())) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'Invalid phone number'
        )
      }

      const sanitizedData = {
        fullName: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        phoneNumber: userData.phoneNumber.trim(),
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

      const userRef = db.getRef('users')
      let newUserRef

      if (userId) {
        // Use custom ID (number)
        newUserRef = userRef.child(userId)
      } else {
        // Generate automatic numeric ID
        const newCustomId = await generateCustomId()
        userId = parseInt(newCustomId)
        newUserRef = userRef.child(userId)
      }

      await newUserRef.set({ _id: userId, ...sanitizedData })

      return {
        userId,
        message: 'User created successfully, please verify OTP'
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Failed to create user: ${error.message}`
        )
    }
  },

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User object
   * @throws {ApiError} - If user not found or inactive
   */
  findById: async (userId) => {
    try {
      if (!userId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'User ID is required'
        )
      }
      const snapshot = await db.getRef(`users/${userId}`).once('value')
      const user = snapshot.val()
      if (!user || !user.isActive) {
        throw new ApiError(
          httpStatus.status.NOT_FOUND,
          'User not found or not activated'
        )
      }
      return { _id: userId, ...user }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Failed to get user information: ${error.message}`
        )
    }
  },

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object
   * @throws {ApiError} - If user not found or inactive
   */
  findByEmail: async (email) => {
    try {
      if (!email) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email is required')
      }
      const snapshot = await db
        .getRef('users')
        .orderByChild('email')
        .equalTo(email.trim().toLowerCase())
        .once('value')
      const users = snapshot.val()
      if (!users) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found')
      }
      const userId = Object.keys(users)[0]
      const user = users[userId]
      if (!user.isActive) {
        throw new ApiError(
          httpStatus.status.NOT_FOUND,
          'User not found or not activated'
        )
      }
      return { _id: userId, ...user }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Failed to get user information: ${error.message}`
        )
    }
  },

  /**
   * Find user by email (without checking isActive)
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object
   * @throws {ApiError} 404 - User not found
   */
  findByEmailForActivation: async (email) => {
    try {
      if (!email) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email is required')
      }
      const snapshot = await db
        .getRef('users')
        .orderByChild('email')
        .equalTo(email.trim().toLowerCase())
        .once('value')
      const users = snapshot.val()
      if (!users) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found')
      }
      const userId = Object.keys(users)[0]
      const user = users[userId]
      return { _id: userId, ...user }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Failed to get user information: ${error.message}`
        )
    }
  },

  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<boolean>} - Update status
   * @throws {ApiError} - If update fails
   */
  update: async (userId, updateData) => {
    try {
      if (!userId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'User ID is required'
        )
      }
      const sanitizedUpdateData = {
        updatedAt: Date.now()
      }

      // Only add fields that have values
      if (updateData.email) {
        sanitizedUpdateData.email = updateData.email.trim().toLowerCase()
      }
      if (updateData.fullName) {
        sanitizedUpdateData.fullName = updateData.fullName.trim()
      }
      if (updateData.phoneNumber) {
        sanitizedUpdateData.phoneNumber = updateData.phoneNumber.trim()
      }
      if (updateData.avatar) {
        sanitizedUpdateData.avatar = updateData.avatar.trim()
      }
      if (updateData.isOnline !== undefined) {
        sanitizedUpdateData.isOnline = updateData.isOnline
      }
      if (updateData.lastSeen) {
        sanitizedUpdateData.lastSeen = updateData.lastSeen
      }
      if (updateData.lastLogin) {
        sanitizedUpdateData.lastLogin = updateData.lastLogin
      }
      // Check phone number format if being updated
      if (sanitizedUpdateData.phoneNumber) {
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(sanitizedUpdateData.phoneNumber)) {
          throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            'Invalid phone number'
          )
        }
      }
      await db.getRef(`users/${userId}`).update(sanitizedUpdateData)
      return true
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Failed to update user: ${error.message}`
        )
    }
  },

  /**
   * Activate user after OTP verification
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Activation status
   * @throws {ApiError} - If activation fails
   */
  activateUser: async (userId) => {
    try {
      if (!userId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'User ID is required'
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
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Failed to activate user: ${error.message}`
        )
    }
  }
}

module.exports = {
  create: userModel.create,
  findById: userModel.findById,
  findByEmail: userModel.findByEmail,
  findByEmailForActivation: userModel.findByEmailForActivation,
  update: userModel.update,
  activateUser: userModel.activateUser
}
