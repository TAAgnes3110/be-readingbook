const { catchAsync } = require('../../src/utils/index')
const { userService } = require('../../src/services/index')

/**
 * Tạo user mới
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body)

  if (result.success) {
    res.status(201).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Xóa mềm user
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await userService.deleteUserById({ userId })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Xóa vĩnh viễn user
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const hardDeleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await userService.hardDeleteUserById({ userId })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Khôi phục user đã bị xóa mềm
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const restoreUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await userService.restoreUserById({ userId })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Lấy danh sách users đã bị xóa mềm
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getDeletedUsers = catchAsync(async (req, res) => {
  const result = await userService.getDeletedUsers({ options: req.query })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Lấy thống kê users
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getUserStats = catchAsync(async (req, res) => {
  const result = await userService.getUserStats()

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

module.exports = {
  createUser,
  deleteUser,
  hardDeleteUser,
  restoreUser,
  getDeletedUsers,
  getUserStats
}
