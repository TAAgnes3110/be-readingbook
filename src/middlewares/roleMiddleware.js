const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const userModel = require('./userModel')
const logger = require('../config/logger')

const roleMiddleware = (requiredRole) => async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId)
    if (user.role !== requiredRole) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Bạn không có quyền thực hiện hành động này'
      )
    }
    next()
  } catch (error) {
    logger.error(`Lỗi kiểm tra vai trò cho user ${req.userId}: ${error.stack}`)
    next(
      error instanceof ApiError
        ? error
        : new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi kiểm tra vai trò')
    )
  }
}

module.exports = roleMiddleware
