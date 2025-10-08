const { ApiError } = require('../utils/index')
const { categoryModel } = require('../models/index')
const httpStatus = require('http-status')

/**
 * Tạo thể loại mới
 * @param {Object} categoryBody - Dữ liệu thể loại
 * @returns {Promise<Object>} - Đối tượng thể loại đã tạo
 */
const createCategory = async (data) => {
  const { categoryBody } = data;
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
 * @returns {Promise<Object>} - Danh sách thể loại
 */
const getAllCategories = async (data) => {
  try {
    const categories = await categoryModel.findAll()
    return {
      success: true,
      data: { categories }
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
 * @param {string} categoryId - ID thể loại
 * @returns {Promise<Object>} - Thể loại
 */
const getCategoryById = async (data) => {
  const { categoryId } = data;
  try {
    const category = await categoryModel.findById(categoryId)
    return {
      success: true,
      data: { category }
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
 * Cập nhật thể loại
 * @param {string} categoryId - ID thể loại
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Thể loại đã cập nhật
 */
const updateCategory = async (data) => {
  const { categoryId, updateData } = data;
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
 * Xóa thể loại
 * @param {string} categoryId - ID thể loại
 * @returns {Promise<Object>} - Kết quả xóa
 */
const deleteCategory = async (data) => {
  const { categoryId } = data;
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
 * Lấy ID hiện tại lớn nhất của category
 * @returns {Promise<Object>} - ID hiện tại
 */
const getCurrentMaxCategoryId = async (data) => {
  try {
    const maxId = await categoryModel.getCurrentMaxCategoryId()
    return {
      success: true,
      data: { currentMaxId: maxId }
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
