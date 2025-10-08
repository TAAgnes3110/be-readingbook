const { bookModel } = require('../models/index')
const logger = require('../config/logger')

/**
 * Lấy danh sách sách với tìm kiếm và phân trang
 * @param {Object} data - Dữ liệu tìm kiếm
 * @param {Object} data.options - Các tùy chọn tìm kiếm
 * @param {number} data.options.page - Trang hiện tại
 * @param {number} data.options.limit - Số lượng sách trên mỗi trang
 * @param {string} data.options.search - Từ khóa tìm kiếm
 * @param {string} data.options.category - Thể loại sách
 * @param {string} data.options.status - Trạng thái sách
 * @param {string} data.options.sortBy - Trường sắp xếp
 * @param {string} data.options.sortOrder - Thứ tự sắp xếp
 * @returns {Object} data - Dữ liệu sách
 * @returns {Array} data.books - Danh sách sách
 * @returns {Object} data.pagination - Thông tin phân trang
 * @returns {number} data.pagination.page - Trang hiện tại
 * @returns {number} data.pagination.limit - Số lượng sách trên mỗi trang
 * @returns {number} data.pagination.total - Tổng số lượng sách
 * @returns {number} data.pagination.totalPages - Tổng số trang
 */
const getBooksList = async (data) => {
  const { options = {} } = data || {}
  try {
    const result = await bookModel.search(options)
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
 * Lấy sách theo ID
 * @param {Object} data - Dữ liệu sách
 * @param {string} data.id - ID sách
 * @returns {Object} data - Dữ liệu sách
 * @returns {Object} data.book - Sách
 */
const getBookById = async (data) => {
  const { id } = data
  try {
    const book = await bookModel.getById(id)
    return {
      success: true,
      data: { book }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Tạo sách mới
 * @param {Object} data - Dữ liệu sách
 * @param {Object} data.bookData - Dữ liệu sách
 * @returns {Object} data - Dữ liệu sách
 * @returns {Object} data.book - Sách
 */
const createBook = async (data) => {
  const { bookData } = data
  try {
    const book = await bookModel.create(bookData)
    return {
      success: true,
      data: { book },
      message: 'Tạo sách thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Cập nhật sách
 * @param {Object} data - Dữ liệu sách
 * @param {string} data.id - ID sách
 * @param {Object} data.updateData - Dữ liệu sách cập nhật
 * @returns {Object} data - Dữ liệu sách
 * @returns {Object} data.book - Sách
 */
const updateBookById = async (data) => {
  const { id, updateData } = data
  try {
    const book = await bookModel.update(id, updateData)
    return {
      success: true,
      data: { book },
      message: 'Cập nhật sách thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Xóa sách
 * @param {Object} data - Dữ liệu sách
 * @param {string} data.id - ID sách
 * @returns {Object} Kết quả tìm kiếm
 * @returns {Object} data - Dữ liệu sách
 * @returns {Object} data.book - Sách
 */
const deleteBookById = async (data) => {
  const { id } = data
  try {
    await bookModel.delete(id)
    return {
      success: true,
      message: 'Xóa sách thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy sách mới nhất
 * @param {Object} data - Dữ liệu sách
 * @param {number} data.limit - Số lượng sách
 * @returns {Object} Kết quả tìm kiếm
 * @returns {Array} data.books - Danh sách sách
 */
const getLatestBooks = async (data) => {
  const { limit = 10 } = data || {}
  try {
    const books = await bookModel.getLatest(limit)
    return {
      success: true,
      data: { books }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy ID lớn nhất
 * @returns {Object} Kết quả tìm kiếm
 * @returns {Object} data.currentMaxId - ID lớn nhất
 */
const getCurrentMaxBookId = async () => {
  try {
    const maxId = await bookModel.getMaxId()
    return {
      success: true,
      data: { currentMaxId: maxId }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy thông tin chi tiết của các sách yêu thích
 * @param {Object} data - Dữ liệu sách
 * @param {Array} data.bookIds - Danh sách ID sách
 * @returns {Object} Kết quả tìm kiếm
 * @returns {Array} data.books - Danh sách sách yêu thích
 */
const getFavoriteBooksDetails = async (data) => {
  const { bookIds } = data
  try {
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return {
        success: true,
        data: { books: [] }
      }
    }

    const books = []
    for (const bookId of bookIds) {
      try {
        const book = await bookModel.getById(bookId)
        if (book) {
          books.push(book)
        }
      } catch (error) {
        // Bỏ qua sách không tồn tại
        logger.warn(`Book with ID ${bookId} not found`)
      }
    }

    return {
      success: true,
      data: { books }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

module.exports = {
  getBooksList,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getLatestBooks,
  getCurrentMaxBookId,
  getFavoriteBooksDetails
}
