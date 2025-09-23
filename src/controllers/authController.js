const httpStatus = require('http-status')
const { catchAsync } = require('../utils/index')
const { authService } = require('../services/index')

/**
 * Đăng ký người dùng mới
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const register = catchAsync(async (req, res) => {
  const result = await authService.SignUp(req.body)
  res.status(httpStatus.CREATED).json({
    success: true,
    data: { userId: result.userId },
    message: result.message
  })
})

/**
 * Xác minh OTP và kích hoạt tài khoản
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const verifyOTP = catchAsync(async (req, res) => {
  const { userId, email, otp } = req.body
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
  const { email, password } = req.body
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
  const { email } = req.body
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
  const { email, otp, newPassword } = req.body
  const result = await authService.resetPassword(email, otp, newPassword)
  res.json({
    success: true,
    message: result.message
  })
})

/**
 * Đăng xuất người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body
  await authService.logout(refreshToken)
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Đăng xuất thành công'
  })
})

/**
 * Làm mới token
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Phản hồi HTTP
 */
const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body
  const tokens = await authService.refreshTokens(refreshToken)
  res.json({
    success: true,
    data: tokens,
    message: 'Làm mới token thành công'
  })
})

module.exports = {
  register,
  verifyOTP,
  login,
  requestResetPassword,
  resetPassword,
  logout,
  refreshTokens
}
