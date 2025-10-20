const { ApiError } = require('../utils/index')
const { categoryModel } = require('../models/index')
const httpStatus = require('http-status')

/**
 * Tạo thể loại mới
 * @param {Object} categoryBody - Dữ liệu thể loại
 * @returns {Promise<Object>} - Thông tin thể loại đã tạo
 * @throws {ApiError} - Nếu tạo thể loại thất bại
 */
const createCategory = async (categoryBody) => {
  try {
    const { name, image_url } = categoryBody

    if (!name || !image_url) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Tên thể loại và ảnh là bắt buộc'
      )
    }

    const existedCategory = await categoryModel.findByName(name)
    if (existedCategory) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Tên thể loại đã tồn tại'
      )
    }

    const newCategory = {
      name: name.trim(),
      image_url: image_url.trim(),
      status: 'active'
    }

    const result = await categoryModel.create(newCategory)

    return {
      success: true,
      data: {
        category: {
          _id: result.categoryId,
          ...newCategory,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Tạo thể loại thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy tất cả thể loại
 * @returns {Promise<Object>} - Danh sách thể loại và thông báo
 * @throws {ApiError} - Nếu lấy danh sách thất bại
 */
const getAllCategories = async () => {
  try {
    const categories = await categoryModel.findAll()
    return {
      success: true,
      data: { categories },
      message: 'Lấy danh sách thể loại thành công'
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Lấy danh sách thể loại thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy thể loại theo ID
 * @param {string} categoryId - ID của thể loại
 * @returns {Promise<Object>} - Thông tin thể loại và thông báo
 * @throws {ApiError} - Nếu không tìm thấy thể loại
 */
const getCategoryById = async (categoryId) => {
  try {
    const category = await categoryModel.findById(categoryId)
    return {
      success: true,
      data: { category },
      message: 'Lấy thể loại thành công'
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Lấy thể loại thất bại: ${error.message}`
    )
  }
}

/**
 * Cập nhật thể loại theo ID
 * @param {string} categoryId - ID của thể loại
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Thông tin thể loại đã cập nhật
 * @throws {ApiError} - Nếu cập nhật thất bại
 */
const updateCategory = async (categoryId, updateData) => {
  try {
    await categoryModel.update(categoryId, updateData)
    const updatedCategory = await categoryModel.findById(categoryId)

    return {
      success: true,
      data: { category: updatedCategory }
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Cập nhật thể loại thất bại: ${error.message}`
    )
  }
}

/**
 * Xóa thể loại theo ID
 * @param {string} categoryId - ID của thể loại
 * @returns {Promise<Object>} - Thông báo kết quả xóa
 * @throws {ApiError} - Nếu xóa thất bại
 */
const deleteCategory = async (categoryId) => {
  try {
    await categoryModel.delete(categoryId)
    return {
      success: true,
      message: 'Xóa thể loại thành công'
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Xóa thể loại thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy ID thể loại lớn nhất hiện tại
 * @returns {Promise<Object>} - ID thể loại lớn nhất và thông báo
 * @throws {ApiError} - Nếu lấy ID thất bại
 */
const getCurrentMaxCategoryId = async () => {
  try {
    const maxId = await categoryModel.getCurrentMaxCategoryId()
    return {
      success: true,
      data: { currentMaxId: maxId },
      message: 'Lấy ID hiện tại thành công'
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Lấy ID hiện tại thất bại: ${error.message}`
    )
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCurrentMaxCategoryId
}
