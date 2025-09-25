const httpStatus = require('http-status')
const { catchAsync } = require('../utils/index')
const { authService } = require('../services/index')

/**
 * Register new user
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
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
 * Login user
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  res.json({
    success: true,
    data: result,
    message: 'Login successful'
  })
})

/**
 * Verify OTP and activate account
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body
  const result = await authService.verifyAndActivateUser(email, otp)
  res.json({
    success: true,
    message: result.message
  })
})

/**
 * Resend OTP
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body
  const result = await authService.resendOTP(email)
  res.json({
    success: true,
    message: result.message
  })
})


module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP
}
