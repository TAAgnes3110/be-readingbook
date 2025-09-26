const db = require('../config/db.js')
const { ApiError } = require('../utils/index')
const { hashPassword, comparePassword } = require('../utils/passwordUtils')
const { generateCustomId } = require('../utils/idUtils')
const { getUserError } = require('../constants/errorMessages')
const httpStatus = require('http-status')

const VALIDATION_RULES = {
  PHONE_REGEX: /^[0-9]{10,11}$/,
  DEFAULT_ROLE: 'user',
  DEFAULT_AVATAR: '',
  DEFAULT_PREFERENCES: []
}


/**
 * Validate and sanitize user data for creation
 * @param {Object} userData - Raw user data
 * @returns {Object} - Sanitized user data
 * @throws {ApiError} - If validation fails
 */
const validateAndSanitizeUserData = async (userData) => {
  if (!userData.email || !userData.password || !userData.fullName ||
      !userData.phoneNumber || !userData.confirmPassword) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('REQUIRED_FIELDS'))
  }

  if (userData.password !== userData.confirmPassword) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('PASSWORD_MISMATCH'))
  }

  if (!VALIDATION_RULES.PHONE_REGEX.test(userData.phoneNumber.trim())) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('INVALID_PHONE'))
  }

  return {
    fullName: userData.fullName.trim(),
    email: userData.email.trim().toLowerCase(),
    phoneNumber: userData.phoneNumber.trim(),
    password: await hashPassword(userData.password),
    avatar: userData.avatar?.trim() || VALIDATION_RULES.DEFAULT_AVATAR,
    preferences: Array.isArray(userData.preferences) ? userData.preferences : VALIDATION_RULES.DEFAULT_PREFERENCES,
    isActive: false,
    isOnline: false,
    lastSeen: Date.now(),
    role: userData.role?.trim() || VALIDATION_RULES.DEFAULT_ROLE,
    token: userData.token || null,
    comments: [],
    history: [],
    lastLogin: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

/**
 * Validate custom user ID
 * @param {string|number} userId - User ID to validate
 * @returns {number} - Validated user ID
 * @throws {ApiError} - If ID is invalid
 */
const validateCustomUserId = async (userId) => {
  if (isNaN(userId) || userId <= 0) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('INVALID_USER_ID'))
  }

  const numericId = parseInt(userId)

  const existingUser = await db.getRef(`users/${numericId}`).once('value')
  if (existingUser.val()) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('USER_ID_EXISTS'))
  }

  return numericId
}

/**
 * Sanitize update data
 * @param {Object} updateData - Raw update data
 * @returns {Object} - Sanitized update data
 * @throws {ApiError} - If validation fails
 */
const sanitizeUpdateData = (updateData) => {
  const sanitizedData = {
    ...updateData,
    updatedAt: Date.now()
  }

  // Sanitize string fields
  if (updateData.email) {
    sanitizedData.email = updateData.email.trim().toLowerCase()
  }
  if (updateData.fullName) {
    sanitizedData.fullName = updateData.fullName.trim()
  }
  if (updateData.phoneNumber) {
    sanitizedData.phoneNumber = updateData.phoneNumber.trim()

    // Validate phone number format
    if (!VALIDATION_RULES.PHONE_REGEX.test(sanitizedData.phoneNumber)) {
      throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('INVALID_PHONE'))
    }
  }
  if (updateData.avatar) {
    sanitizedData.avatar = updateData.avatar.trim()
  }

  // Handle boolean and timestamp fields
  if (updateData.isOnline !== undefined) {
    sanitizedData.isOnline = updateData.isOnline
  }
  if (updateData.lastLogin !== undefined) {
    sanitizedData.lastLogin = updateData.lastLogin
  }
  if (updateData.lastSeen !== undefined) {
    sanitizedData.lastSeen = updateData.lastSeen
  } else if (updateData.lastLogin) {
    sanitizedData.lastSeen = Date.now()
  }

  return sanitizedData
}

/**
 * Handle API errors consistently
 * @param {Error} error - Original error
 * @param {string} operation - Operation that failed
 * @throws {ApiError} - Formatted error
 */
const handleError = (error, operation) => {
  throw error instanceof ApiError
    ? error
    : new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to ${operation}: ${error.message}`
    )
}

const userModel = {

  /**
   * Create new user
   * @param {Object} userData - User data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.confirmPassword - Password confirmation
   * @param {string} userData.fullName - User full name
   * @param {string} userData.phoneNumber - User phone number
   * @param {string} [userData.avatar] - User avatar URL
   * @param {Array} [userData.preferences] - User preferences
   * @param {string} [userData.role] - User role
   * @param {string|number} [userData._id] - Custom user ID
   * @returns {Promise<Object>} - User ID and success message
   * @throws {ApiError} - If data is invalid or creation fails
   */
  create: async (userData) => {
    try {
      const sanitizedData = await validateAndSanitizeUserData(userData)

      let userId = userData._id || userData.userId
      if (userId) {
        userId = await validateCustomUserId(userId)
      } else {
        userId = parseInt(await generateCustomId())
      }

      const userRef = db.getRef(`users/${userId}`)
      await userRef.set({ _id: userId, ...sanitizedData })

      return {
        userId,
        message: 'User created successfully, please verify OTP'
      }
    } catch (error) {
      handleError(error, 'create user')
    }
  },


  /**
   * Find user by ID (active users only)
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} - User object with ID
   * @throws {ApiError} - If user not found or inactive
   */
  findById: async (userId) => {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('USER_ID_REQUIRED'))
      }

      const snapshot = await db.getRef(`users/${userId}`).once('value')
      const user = snapshot.val()

      if (!user || !user.isActive) {
        throw new ApiError(httpStatus.status.NOT_FOUND, getUserError('USER_NOT_ACTIVATED'))
      }

      return { _id: userId, ...user }
    } catch (error) {
      handleError(error, 'get user information')
    }
  },

  /**
   * Find user by email (active users only)
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object with ID
   * @throws {ApiError} - If user not found or inactive
   */
  findByEmail: async (email) => {
    try {
      if (!email) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('EMAIL_REQUIRED'))
      }

      const snapshot = await db
        .getRef('users')
        .orderByChild('email')
        .equalTo(email.trim().toLowerCase())
        .once('value')

      const users = snapshot.val()
      if (!users) {
        throw new ApiError(httpStatus.status.NOT_FOUND, getUserError('USER_NOT_FOUND'))
      }

      const userId = Object.keys(users)[0]
      const user = users[userId]

      if (!user.isActive) {
        throw new ApiError(httpStatus.status.NOT_FOUND, getUserError('USER_NOT_ACTIVATED'))
      }

      return { _id: userId, ...user }
    } catch (error) {
      handleError(error, 'get user information')
    }
  },

  /**
   * Find user by email (without checking isActive status)
   * Used for activation and password reset processes
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object with ID
   * @throws {ApiError} - If user not found
   */
  findByEmailForActivation: async (email) => {
    try {
      if (!email) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('EMAIL_REQUIRED'))
      }

      const snapshot = await db
        .getRef('users')
        .orderByChild('email')
        .equalTo(email.trim().toLowerCase())
        .once('value')

      const users = snapshot.val()
      if (!users) {
        throw new ApiError(httpStatus.status.NOT_FOUND, getUserError('USER_NOT_FOUND'))
      }

      const userId = Object.keys(users)[0]
      const user = users[userId]

      return { _id: userId, ...user }
    } catch (error) {
      handleError(error, 'get user information')
    }
  },

  /**
   * Update user information
   * @param {string|number} userId - User ID
   * @param {Object} updateData - Update data
   * @param {string} [updateData.email] - New email
   * @param {string} [updateData.fullName] - New full name
   * @param {string} [updateData.phoneNumber] - New phone number
   * @param {string} [updateData.avatar] - New avatar URL
   * @param {boolean} [updateData.isOnline] - Online status
   * @param {number} [updateData.lastLogin] - Last login timestamp
   * @param {number} [updateData.lastSeen] - Last seen timestamp
   * @returns {Promise<boolean>} - Update success status
   * @throws {ApiError} - If update fails
   */
  update: async (userId, updateData) => {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('USER_ID_REQUIRED'))
      }

      const sanitizedUpdateData = sanitizeUpdateData(updateData)
      await db.getRef(`users/${userId}`).update(sanitizedUpdateData)

      return true
    } catch (error) {
      handleError(error, 'update user')
    }
  },

  /**
   * Activate user after OTP verification
   * @param {string|number} userId - User ID
   * @returns {Promise<boolean>} - Activation success status
   * @throws {ApiError} - If activation fails
   */
  activateUser: async (userId) => {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('USER_ID_REQUIRED'))
      }

      await db.getRef(`users/${userId}`).update({
        isActive: true,
        updatedAt: Date.now()
      })

      return true
    } catch (error) {
      handleError(error, 'activate user')
    }
  },


  /**
   * Verify user password for login
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} - User object if password matches
   * @throws {ApiError} - If user not found, inactive, or password doesn't match
   */
  verifyPassword: async (email, password) => {
    try {
      if (!email || !password) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, getUserError('EMAIL_PASSWORD_REQUIRED'))
      }

      const snapshot = await db
        .getRef('users')
        .orderByChild('email')
        .equalTo(email.trim().toLowerCase())
        .once('value')

      const users = snapshot.val()
      if (!users) {
        throw new ApiError(httpStatus.status.NOT_FOUND, getUserError('USER_NOT_FOUND'))
      }

      const userId = Object.keys(users)[0]
      const user = users[userId]

      if (!user.isActive) {
        throw new ApiError(httpStatus.status.FORBIDDEN, getUserError('ACCOUNT_NOT_ACTIVATED'))
      }

      const isPasswordValid = await comparePassword(password, user.password)
      if (!isPasswordValid) {
        throw new ApiError(httpStatus.status.UNAUTHORIZED, getUserError('INVALID_PASSWORD'))
      }

      return { _id: userId, ...user }
    } catch (error) {
      handleError(error, 'verify password')
    }
  },

}
module.exports = {
  create: userModel.create,
  findById: userModel.findById,
  findByEmail: userModel.findByEmail,
  findByEmailForActivation: userModel.findByEmailForActivation,
  update: userModel.update,
  activateUser: userModel.activateUser,
  verifyPassword: userModel.verifyPassword
}
