const httpStatus = require('http-status')
const { pick, catchAsync } = require('../utils/index')
const { userService, authService } = require('../services/index')

/**
 * Create new user
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Verify OTP for user
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * User login
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Request password reset
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Reset password
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Get user by ID
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Get user by email
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Update user information
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Delete user (soft delete)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Add book to user's favorites
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Remove book from user's favorites
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Get user's favorite books
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
