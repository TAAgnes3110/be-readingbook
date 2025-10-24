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
   * @param {string} body.fullName - Full name (required)
   * @param {string} body.username - Username (3-30 characters)
   * @param {string} body.phoneNumber - Phone number (10-11 digits)
   * @param {string} [body.role='user'] - User role ('user' or 'admin')
   * @param {Array<string>} [body.preferences] - User preferences
   * @param {string} [body.avatar] - Avatar URL
   * @return {Object} Joi validation schema
   */
  createUser: {
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
      password: Joi.string().required().custom(password).messages({
        'any.required': 'Mật khẩu là bắt buộc'
      }),
      fullName: Joi.string().required().messages({
        'any.required': 'Họ tên là bắt buộc'
      }),
      username: Joi.string().required().min(3).max(30).messages({
        'any.required': 'Tên người dùng là bắt buộc',
        'string.min': 'Tên người dùng phải có ít nhất 3 ký tự',
        'string.max': 'Tên người dùng không được quá 30 ký tự'
      }),
      phoneNumber: Joi.string()
        .required()
        .pattern(/^[0-9]{10,11}$/)
        .messages({
          'any.required': 'Số điện thoại là bắt buộc',
          'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
        }),
      role: Joi.string().valid('user', 'admin').default('user').messages({
        'any.only': 'Vai trò phải là user hoặc admin'
      }),
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
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      }),
      email: Joi.string().required().email().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
      otp: Joi.string().required().messages({
        'any.required': 'Mã OTP là bắt buộc'
      })
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
      email: Joi.string().required().email().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
      password: Joi.string().required().messages({
        'any.required': 'Mật khẩu là bắt buộc'
      })
    })
  },

  /**
   * @param {Object} body - Request body
   * @param {string} body.email - Email address (valid email format)
   * @return {Object} Joi validation schema
   */
  requestResetPassword: {
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      })
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
      email: Joi.string().required().email().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
      otp: Joi.string().required().messages({
        'any.required': 'Mã OTP là bắt buộc'
      }),
      newPassword: Joi.string().required().custom(password).messages({
        'any.required': 'Mật khẩu mới là bắt buộc'
      })
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
      fullName: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer().messages({
        'number.base': 'Giới hạn phải là số'
      }),
      page: Joi.number().integer().messages({
        'number.base': 'Trang phải là số'
      })
    })
  },

  /**
   * @param {Object} query - Query parameters
   * @param {string} query.email - Email address (valid email format)
   * @return {Object} Joi validation schema
   */
  getUser: {
    query: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      })
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @param {Object} body - Request body (at least 1 field required)
   * @param {string} [body.email] - Email address (valid email format)
   * @param {string} [body.password] - Password (custom validation)
   * @param {string} [body.fullName] - Full name
   * @param {string} [body.username] - Username (3-30 characters)
   * @param {string} [body.phoneNumber] - Phone number (10-11 digits)
   * @param {Array<string>} [body.preferences] - User preferences
   * @param {string} [body.avatar] - Avatar URL
   * @param {boolean} [body.isActive] - User active status
   * @return {Object} Joi validation schema
   */
  updateUser: {
    params: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      })
    }),
    body: Joi.object()
      .keys({
        email: Joi.string().email().messages({
          'string.email': 'Email không hợp lệ'
        }),
        password: Joi.string().custom(password),
        fullName: Joi.string(),
        username: Joi.string().min(3).max(30).messages({
          'string.min': 'Tên người dùng phải có ít nhất 3 ký tự',
          'string.max': 'Tên người dùng không được quá 30 ký tự'
        }),
        phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).messages({
          'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
        }),
        preferences: Joi.array().items(Joi.string()),
        avatar: Joi.string(),
        isActive: Joi.boolean()
      })
      .min(1)
      .messages({
        'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
      })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @return {Object} Joi validation schema
   */
  deleteUser: {
    params: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      })
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
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      }),
      bookId: Joi.string().required().messages({
        'any.required': 'ID sách là bắt buộc'
      })
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
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      }),
      bookId: Joi.string().required().messages({
        'any.required': 'ID sách là bắt buộc'
      })
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @return {Object} Joi validation schema
   */
  getUserById: {
    params: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      })
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @return {Object} Joi validation schema
   */
  getFavoriteBooks: {
    params: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      })
    })
  },

  /**
   * Đánh giá app
   * @param {Object} body - request body
   * @param {string} body.userId - user id
   *
   * @param {string} body.comment - comment
   * @return {Object} Joi validation schema
   */

  addRatingApp: {
    body: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      }),
      fullName: Joi.string().required().messages({
        'any.required': 'Họ tên là bắt buộc'
      }),
      phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).messages({
        'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
      }),
      email: Joi.string().email().messages({
        'string.email': 'Email không hợp lệ'
      }),
      comment: Joi.string().required().messages({
        'any.required': 'Bình luận là bắt buộc'
      })
    })
  },

  /**
   * Lấy danh sách đánh giá app của người dùng
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @return {Object} Joi validation schema
   */
  getRatingApp: {
    params: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      })
    })
  },

  /**
   * Xóa đánh giá app của người dùng
   * @param {Object} params - URL parameters
   * @param {string} params.userId - User ID (required)
   * @param {string} params.ratingId - Rating ID (required)
   * @return {Object} Joi validation schema
   */
  deleteRatingApp: {
    params: Joi.object().keys({
      userId: Joi.string().required().messages({
        'any.required': 'ID người dùng là bắt buộc'
      }),
      commentId: Joi.string().required().messages({
        'any.required': 'ID bình luận là bắt buộc'
      })
    })
  }
}

module.exports = userValidation
