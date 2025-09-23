const httpStatus = require('http-status')
const { pick, catchAsync } = require('../utils/index')
const { userService, authService } = require('../services/index')

/**
 * Tạo người dùng mới
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body)
  res.status(httpStatus.CREATED).json({
    success: true,
    data: { userId: result.userId },
    message: result.message
  })
})

/**
 * Xác minh OTP cho người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const verifyUserOTP = catchAsync(async (req, res) => {
  const { userId, email, otp } = pick(req.body, ['userId', 'email', 'otp'])
  const result = await authService.verifyAndActivateUser(userId, email, otp)
  res.json({
    success: true,
    message: result.message
  })
})

/**
 * Đăng nhập người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = pick(req.body, ['email', 'password'])
  const result = await authService.login(email, password)
  res.json({
    success: true,
    data: result,
    message: 'Đăng nhập thành công'
  })
})

/**
 * Yêu cầu đặt lại mật khẩu
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const requestResetPassword = catchAsync(async (req, res) => {
  const { email } = pick(req.body, ['email'])
  const result = await authService.requestResetPassword(email)
  res.json({
    success: true,
    message: result.message
  })
})

/**
 * Đặt lại mật khẩu
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = pick(req.body, [
    'email',
    'otp',
    'newPassword'
  ])
  const result = await authService.resetPassword(email, otp, newPassword)
  res.json({
    success: true,
    message: result.message
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
  const { email } = pick(req.query, ['email'])
  const user = await userService.getUserByEmail(email)
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
  verifyUserOTP,
  login,
  requestResetPassword,
  resetPassword,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
}
