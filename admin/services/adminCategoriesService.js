const { categoriesService } = require('../../src/services/index')
const { categoryModel } = require('../../src/models/index')

/**
 * Xóa vĩnh viễn category khỏi database (hard delete)
 * @param {string} categoryId - ID của category
 * @returns {Promise<Object>} Kết quả xóa
 */
const hardDeleteCategory = async (categoryId) => {
  try {
    await categoryModel.hardDelete(categoryId)
    return {
      success: true,
      message: 'Xóa category vĩnh viễn thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Khôi phục category đã bị xóa mềm
 * @param {string} categoryId - ID của category
 * @returns {Promise<Object>} Kết quả khôi phục
 */
const restoreCategory = async (categoryId) => {
  try {
    await categoryModel.restore(categoryId)
    return {
      success: true,
      message: 'Khôi phục category thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy danh sách categories đã bị xóa mềm
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {Object} data.options - Tùy chọn phân trang
 * @returns {Promise<Object>} Danh sách categories đã xóa
 */
const getDeletedCategories = async (data) => {
  const { options = {} } = data
  try {
    const result = await categoryModel.getDeletedCategories(options)
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
 * Lấy thống kê categories
 * @returns {Promise<Object>} Thống kê categories
 */
const getCategoryStats = async () => {
  try {
    const allCategories = await categoryModel.getAll()
    const deletedCategories = await categoryModel.getDeletedCategories({})

    const stats = {
      totalCategories: allCategories.length,
      activeCategories: allCategories.length,
      deletedCategories: deletedCategories.categories?.length || 0
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
  ...categoriesService,
  hardDeleteCategory,
  restoreCategory,
  getDeletedCategories,
  getCategoryStats
}
