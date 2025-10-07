const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const { bookModel } = require('../models/bookModel')
const { categoryModel } = require('../models/categoryModel')

/**
 * Lấy danh sách sách với tìm kiếm và phân trang
 * @param {Object} options - Tùy chọn tìm kiếm và phân trang
 * @returns {Promise<Object>} - Danh sách sách với thông tin phân trang
 * @throws {ApiError} 500 - Lỗi máy chủ nội bộ
 */
const getBooksList = async () => {
  try {
    const books = await bookModel.findAll()
    return {
      success: true,
      data: { books }
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Lấy danh sách sách thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy sách theo ID
 * @param {string} bookId - ID sách
 * @returns {Promise<Object>} - Đối tượng sách
 * @throws {ApiError} 404 - Không tìm thấy sách
 */
const getBookById = async (bookId) => {
  try {
    if (!bookId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'ID sách là bắt buộc'
      )
    }

    const book = await bookModel.findById(bookId)
    return {
      success: true,
      data: { book }
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Lấy sách thất bại: ${error.message}`
    )
  }
}

/**
 * Tạo sách mới
 * @param {Object} bookData - Dữ liệu sách
 * @returns {Promise<Object>} - Đối tượng sách đã tạo
 * @throws {ApiError} 400 - Dữ liệu không hợp lệ
 */
const createBook = async (bookData) => {
  try {
    // Kiểm tra thể loại tồn tại
    if (bookData.category) {
      const category = await categoryModel.getById(bookData.category)
      if (!category) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Thể loại không tồn tại'
        )
      }
    }

    const result = await bookModel.create(bookData)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Tạo sách thất bại: ${error.message}`
    )
  }
}

/**
 * Cập nhật sách theo ID
 * @param {string} bookId - ID sách
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Đối tượng sách đã cập nhật
 * @throws {ApiError} 404 - Không tìm thấy sách
 */
const updateBookById = async (bookId, updateData) => {
  try {
    if (!bookId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'ID sách là bắt buộc'
      )
    }

    // Kiểm tra thể loại nếu được cung cấp
    if (updateData.category) {
      const category = await categoryModel.getById(updateData.category)
      if (!category) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Thể loại không tồn tại'
        )
      }
    }

    const result = await bookModel.update(bookId, updateData)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Cập nhật sách thất bại: ${error.message}`
    )
  }
}

/**
 * Xóa sách theo ID
 * @param {string} bookId - ID sách
 * @returns {Promise<Object>} - Kết quả xóa
 * @throws {ApiError} 404 - Không tìm thấy sách
 */
const deleteBookById = async (bookId) => {
  try {
    if (!bookId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'ID sách là bắt buộc'
      )
    }

    const result = await bookModel.delete(bookId)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Xóa sách thất bại: ${error.message}`
    )
  }
}

/**
 * Tìm kiếm sách theo tên
 * @param {string} title - Tên tìm kiếm
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {Promise<Object>} - Kết quả tìm kiếm
 * @throws {ApiError} 400 - Từ khóa tìm kiếm không hợp lệ
 */
const searchBooksByTitle = async (title, options = {}) => {
  try {
    if (!title || title.trim() === '') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Tên tìm kiếm là bắt buộc'
      )
    }

    const searchOptions = {
      search: title.trim(),
      ...options
    }

    const result = await bookModel.getList(searchOptions)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Tìm kiếm sách thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy sách theo thể loại
 * @param {string} categoryId - ID thể loại
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {Promise<Object>} - Sách trong thể loại
 * @throws {ApiError} 400 - Thể loại không hợp lệ
 */
const getBooksByCategory = async (categoryId, options = {}) => {
  try {
    if (!categoryId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'ID thể loại là bắt buộc'
      )
    }

    // Kiểm tra thể loại tồn tại
    const category = await categoryModel.getById(categoryId)
    if (!category) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Thể loại không tồn tại'
      )
    }

    const searchOptions = {
      category: categoryId,
      ...options
    }

    const result = await bookModel.getList(searchOptions)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Lấy sách theo thể loại thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy sách mới nhất
 * @param {number} limit - số lượng sách muốn lấy
 * @returns {Promise<Object>} - Danh sách sách mới nhất
 */
const getLatestBooks = async (limit = 10) => {
  try {
    const result = await bookModel.getLatest(limit)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Lấy sách mới nhất thất bại: ${error.message}`
    )
  }
}

/**
 * Lấy ID hiện tại lớn nhất của book
 * @returns {Promise<Object>} - ID hiện tại
 */
const getCurrentMaxBookId = async () => {
  try {
    const maxId = await bookModel.getCurrentMaxBookId()
    return {
      success: true,
      data: { currentMaxId: maxId }
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Lấy ID hiện tại thất bại: ${error.message}`
    )
  }
}

module.exports = {
  getBooksList,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  searchBooksByTitle,
  getBooksByCategory,
  getCurrentMaxBookId,
  getLatestBooks
}
