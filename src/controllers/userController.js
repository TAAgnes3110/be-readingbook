const httpStatus = require('http-status-codes')
const pick = require('../utils/pick')
const ApiError = require('../utils/ApiErrors')
const catchAsync = require('../utils/catchAsync')
const { userService } = require('../services')

/**
 * Tạo người dùng mới
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body)
  res.status(httpStatus.CREATED).json({
    success: true,
    data: user,
    message: 'Tạo người dùng thành công'
  })
})

/**
 * Lấy thông tin người dùng theo ID
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const getUserById = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  const user = await userService.getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại')
  }
  res.json({
    success: true,
    data: user,
    message: 'Lấy thông tin người dùng thành công'
  })
})

/**
 * Lấy thông tin người dùng theo email
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const getUserByEmail = catchAsync(async (req, res) => {
  const { email } = pick(req.query, ['email']) // Sử dụng query thay vì params
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại')
  }
  res.json({
    success: true,
    data: user,
    message: 'Lấy thông tin người dùng theo email thành công'
  })
})

/**
 * Cập nhật thông tin người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const updateUser = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  const user = await userService.updateUserById(userId, req.body)
  res.json({
    success: true,
    data: user,
    message: 'Cập nhật người dùng thành công'
  })
})

/**
 * Xóa người dùng (soft delete)
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  await userService.deleteUserById(userId)
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Xóa người dùng thành công'
  })
})

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
}
