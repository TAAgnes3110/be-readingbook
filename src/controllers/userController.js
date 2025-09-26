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
  res.status(httpStatus.status.CREATED).json({
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
 * Get user by ID
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getUserById = catchAsync(async (req, res) => {
  const { userId } = pick(req.params, ['userId'])
  const user = await userService.getUserById(userId)
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
  const user = await userService.getUserByEmail(email)
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
  const user = await userService.updateUserById(userId, req.body)
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
  await userService.deleteUserById(userId)
  res.status(httpStatus.status.NO_CONTENT).json({
    success: true,
    message: 'User deleted successfully'
  })
})

module.exports = {
  createUser,
  verifyUserOTP,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
}
