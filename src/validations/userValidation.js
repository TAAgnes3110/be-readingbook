const Joi = require('joi')
const { password } = require('./custom')

/**
 * Validation schemas for user operations
 * @namespace userValidation
 */
const userValidation = {
  /**
   * @param {Object} body - Request body
   * @param {string} body.email - Email address (valid email format)
   * @param {string} body.password - Password (custom validation)
   * @param {string} body.fullname - Full name (required)
   * @param {string} body.username - Username (3-30 characters)
   * @param {string} body.phonenumber - Phone number (10-11 digits)
   * @param {string} [body.role='user'] - User role ('user' or 'admin')
   * @param {Array<string>} [body.preferences] - User preferences
   * @param {string} [body.avatar] - Avatar URL
   * @return {Object} Joi validation schema
   */
  createUser: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      fullname: Joi.string().required(),
      username: Joi.string().required().min(3).max(30),
      phonenumber: Joi.string()
        .required()
        .pattern(/^[0-9]{10,11}$/),
      role: Joi.string().valid('user', 'admin').default('user'),
      preferences: Joi.array().items(Joi.string()),
      avatar: Joi.string()
    })
  },

  /**
   * @param {Object} body - Request body
   * @param {string} body.userId - User ID (required)
   * @param {string} body.email - Email address (valid email format)
   * @param {string} body.otp - OTP code (required)
   * @return {Object} Joi validation schema
   */
  verifyUserOTP: {
    body: Joi.object().keys({
      userId: Joi.string().required(),
      email: Joi.string().required().email(),
      otp: Joi.string().required()
    })
  },

  /**
   * @param {Object} body - Request body
   * @param {string} body.email - Email address (valid email format)
   * @param {string} body.password - Password (required)
   * @return {Object} Joi validation schema
   */
  login: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    })
  },

  /**
   * @param {Object} body - Request body
   * @param {string} body.email - Email address (valid email format)
   * @return {Object} Joi validation schema
   */
  requestResetPassword: {
    body: Joi.object().keys({
      email: Joi.string().required().email()
    })
  },

  /**
   * @param {Object} body - Request body
   * @param {string} body.email - Email address (valid email format)
   * @param {string} body.otp - OTP code (required)
   * @param {string} body.newPassword - New password (custom validation)
   * @return {Object} Joi validation schema
   */
  resetPassword: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      otp: Joi.string().required(),
      newPassword: Joi.string().required().custom(password)
    })
  },

  /**
   * @param {Object} query - Query parameters
   * @param {string} [query.fullname] - Filter by full name
   * @param {string} [query.role] - Filter by role
   * @param {string} [query.sortBy] - Sort field
   * @param {number} [query.limit] - Items per page
   * @param {number} [query.page] - Page number
   * @return {Object} Joi validation schema
   */
  getUsers: {
    query: Joi.object().keys({
      fullname: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  },

  /**
   * @param {Object} query - Query parameters
   * @param {string} query.email - Email address (valid email format)
   * @return {Object} Joi validation schema
   */
  getUser: {
    query: Joi.object().keys({
      email: Joi.string().required().email()
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @param {Object} body - Request body (at least 1 field required)
   * @param {string} [body.email] - Email address (valid email format)
   * @param {string} [body.password] - Password (custom validation)
   * @param {string} [body.fullname] - Full name
   * @param {string} [body.username] - Username (3-30 characters)
   * @param {string} [body.phonenumber] - Phone number (10-11 digits)
   * @param {Array<string>} [body.preferences] - User preferences
   * @param {string} [body.avatar] - Avatar URL
   * @param {boolean} [body.isActive] - User active status
   * @return {Object} Joi validation schema
   */
  updateUser: {
    params: Joi.object().keys({
      userId: Joi.string().required()
    }),
    body: Joi.object()
      .keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        fullname: Joi.string(),
        username: Joi.string().min(3).max(30),
        phonenumber: Joi.string().pattern(/^[0-9]{10,11}$/),
        preferences: Joi.array().items(Joi.string()),
        avatar: Joi.string(),
        isActive: Joi.boolean()
      })
      .min(1)
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @return {Object} Joi validation schema
   */
  deleteUser: {
    params: Joi.object().keys({
      userId: Joi.string().required()
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @param {string} params.bookId - Book ID (required)
   * @return {Object} Joi validation schema
   */
  addFavoriteBook: {
    params: Joi.object().keys({
      userId: Joi.string().required(),
      bookId: Joi.string().required()
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @param {string} params.bookId - Book ID (required)
   * @return {Object} Joi validation schema
   */
  removeFavoriteBook: {
    params: Joi.object().keys({
      userId: Joi.string().required(),
      bookId: Joi.string().required()
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @return {Object} Joi validation schema
   */
  getFavoriteBooks: {
    params: Joi.object().keys({
      userId: Joi.string().required()
    })
  }
}

module.exports = userValidation
