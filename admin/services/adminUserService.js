const { userService } = require('../../src/services/index')
const { userModel } = require('../../src/models/index')

/**
 * Xóa vĩnh viễn user khỏi database (hard delete)
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {string} data.userId - ID của user
 * @returns {Promise<Object>} Kết quả xóa
 */
const hardDeleteUserById = async (data) => {
  const { userId } = data
  try {
    await userModel.hardDelete(userId)
    return {
      success: true,
      message: 'Xóa user vĩnh viễn thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Khôi phục user đã bị xóa mềm
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {string} data.userId - ID của user
 * @returns {Promise<Object>} Kết quả khôi phục
 */
const restoreUserById = async (data) => {
  const { userId } = data
  try {
    await userModel.restore(userId)
    return {
      success: true,
      message: 'Khôi phục user thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy danh sách users đã bị xóa mềm
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {Object} data.options - Tùy chọn phân trang
 * @returns {Promise<Object>} Danh sách users đã xóa
 */
const getDeletedUsers = async (data) => {
  const { options = {} } = data
  try {
    const result = await userModel.getDeletedUsers(options)
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy thống kê users (admin only)
 * @returns {Promise<Object>} Thống kê users
 */
const getUserStats = async () => {
  try {
    const allUsers = await userModel.getAll()
    const deletedUsers = await userModel.getDeletedUsers({})

    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.length,
      deletedUsers: deletedUsers.users?.length || 0,
      newUsersThisMonth: allUsers.filter(user => {
        const userDate = new Date(user.createdAt)
        const now = new Date()
        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
      }).length
    }

    return {
      success: true,
      data: stats
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

module.exports = {
  // Re-export các service từ src
  ...userService,

  // Admin-specific services
  hardDeleteUserById,
  restoreUserById,
  getDeletedUsers,
  getUserStats
}
