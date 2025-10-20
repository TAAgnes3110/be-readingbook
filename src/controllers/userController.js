const httpStatus = require('http-status')
const { pick, catchAsync } = require('../utils/index')
const { userService, authService } = require('../services/index')

/**
 * Tạo người dùng mới
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
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
 * Xác thực OTP cho người dùng
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
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
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = pick(req.body, ['email', 'password'])
  const result = await authService.login(email, password)
  res.json({
    success: true,
    data: result,
    message: 'Login successful'
  })
})

/**
 * Yêu cầu đặt lại mật khẩu
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
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
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
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
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const getUserById = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  const user = await userService.getUserById({ id: userId })
  res.json({
    success: true,
    data: user,
    message: 'User retrieved successfully'
  })
})

/**
 * Lấy thông tin người dùng theo email
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const getUserByEmail = catchAsync(async (req, res) => {
  const { email } = pick(req.query, ['email'])
  const user = await userService.getUserByEmail({ email })
  res.json({
    success: true,
    data: user,
    message: 'User retrieved by email successfully'
  })
})

/**
 * Cập nhật thông tin người dùng
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const updateUser = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  const user = await userService.updateUserById({ userId, updateBody: req.body })
  res.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  })
})

/**
 * Xóa người dùng (xóa mềm)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  await userService.deleteUserById({ userId })
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'User deleted successfully'
  })
})

/**
 * Thêm sách vào danh sách yêu thích
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const addFavoriteBook = catchAsync(async (req, res) => {
  const { userId, bookId } = pick(req.params, ['userId', 'bookId'])
  const result = await userService.addFavoriteBook({ userId, bookId })
  res.json({
    success: result.success,
    message: result.message
  })
})

/**
 * Xóa sách khỏi danh sách yêu thích
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const removeFavoriteBook = catchAsync(async (req, res) => {
  const { userId, bookId } = pick(req.params, ['userId', 'bookId'])
  const result = await userService.removeFavoriteBook({ userId, bookId })
  res.json({
    success: result.success,
    message: result.message
  })
})

/**
 * Lấy danh sách sách yêu thích của người dùng
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {void}
 */
const getFavoriteBooks = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  const result = await userService.getFavoriteBooks({ userId })
  res.json({
    success: result.success,
    data: result.data,
    message: 'Favorite books retrieved successfully'
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
  deleteUser,
  addFavoriteBook,
  removeFavoriteBook,
  getFavoriteBooks
}
