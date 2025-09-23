const httpStatus = require('http-status')
const logger = require('../config/logger')
const { ApiError } = require('../utils/index')
const { tokenService, otpService } = require('../services/index')
const userModel = require('../models/userModel')
const { hashPassword, comparePassword } = require('../utils/passwordUtils')

/**
 * Đăng ký người dùng mới
 * @param {Object} userBody - Dữ liệu người dùng
 * @returns {Promise<Object>} - ID người dùng và thông báo
 * @throws {ApiError} - Nếu đăng ký thất bại
 */
async function SignUp(userBody) {
  try {
    const {
      email,
      password,
      fullname,
      phonenumber,
      role = 'user'
    } = userBody
    const userData = {
      email,
      password,
      fullname,
      phonenumber,
      role
    }
    const { userId, message } = await userModel.create(userData)
    return { userId, message }
  } catch (error) {
    logger.error(`Lỗi khi đăng ký người dùng: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Không thể đăng ký: ${error.message}`
      )
  }
}

/**
 * Xác minh OTP và kích hoạt người dùng
 * @param {string} userId - ID của người dùng
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP
 * @returns {Promise<Object>} - Kết quả xác minh
 * @throws {ApiError} - Nếu xác minh thất bại
 */
async function verifyAndActivateUser(userId, email, otp) {
  try {
    const otpResult = await otpService.verifyOTP(email, otp)
    if (!otpResult.success) {
      throw new ApiError(httpStatus.BAD_REQUEST, otpResult.message)
    }
    await userModel.activateUser(userId)
    await otpService.clearOTP(email)
    return { success: true, message: 'Tài khoản đã được kích hoạt' }
  } catch (error) {
    logger.error(`Lỗi khi xác minh OTP cho ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Không thể xác minh OTP: ${error.message}`
      )
  }
}

/**
 * Đăng nhập người dùng
 * @param {string} email - Email của người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} - Thông tin người dùng và token
 * @throws {ApiError} - Nếu đăng nhập thất bại
 */
async function login(email, password) {
  try {
    if (!email || !password) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Yêu cầu cung cấp email và mật khẩu'
      )
    }
    const user = await userModel.findByEmail(email.trim().toLowerCase())
    if (!user.isActive) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Tài khoản chưa được kích hoạt'
      )
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Mật khẩu không đúng')
    }
    const token = await tokenService.generateAuthToken(user._id)
    await userModel.update(user._id, { token, lastLogin: Date.now() })
    return {
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        phonenumber: user.phonenumber,
        role: user.role
      },
      token
    }
  } catch (error) {
    logger.error(`Lỗi khi đăng nhập cho ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Không thể đăng nhập: ${error.message}`
      )
  }
}

/**
 * Yêu cầu đặt lại mật khẩu
 * @param {string} email - Email của người dùng
 * @returns {Promise<Object>} - Thông báo gửi OTP
 * @throws {ApiError} - Nếu yêu cầu thất bại
 */
async function requestResetPassword(email) {
  try {
    if (!email) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Yêu cầu cung cấp email')
    }
    const user = await userModel.findByEmail(email.trim().toLowerCase())
    await otpService.sendOTP(user.email, 'reset')
    return { success: true, message: 'OTP đã được gửi để đặt lại mật khẩu' }
  } catch (error) {
    logger.error(
      `Lỗi khi yêu cầu đặt lại mật khẩu cho ${email}: ${error.stack}`
    )
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Không thể gửi OTP: ${error.message}`
      )
  }
}

/**
 * Đặt lại mật khẩu
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<Object>} - Kết quả đặt lại mật khẩu
 * @throws {ApiError} - Nếu đặt lại thất bại
 */
async function resetPassword(email, otp, newPassword) {
  try {
    if (!email || !otp || !newPassword) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Yêu cầu cung cấp email, OTP và mật khẩu mới'
      )
    }
    const otpResult = await otpService.verifyOTP(
      email.trim().toLowerCase(),
      otp
    )
    if (!otpResult.success) {
      throw new ApiError(httpStatus.BAD_REQUEST, otpResult.message)
    }
    const user = await userModel.findByEmail(email.trim().toLowerCase())
    const hashedPassword = await hashPassword(newPassword)
    await userModel.update(user._id, { password: hashedPassword })
    await otpService.clearOTP(email)
    return { success: true, message: 'Đặt lại mật khẩu thành công' }
  } catch (error) {
    logger.error(`Lỗi khi đặt lại mật khẩu cho ${email}: ${error.stack}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Không thể đặt lại mật khẩu: ${error.message}`
      )
  }
}

module.exports = {
  SignUp,
  verifyAndActivateUser,
  login,
  requestResetPassword,
  resetPassword
}
