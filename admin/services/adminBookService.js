const { bookService } = require('../../src/services/index')
const { bookModel } = require('../../src/models/index')

/**
 * Xóa vĩnh viễn sách khỏi database (hard delete)
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {string} data.id - ID của sách
 * @returns {Promise<Object>} Kết quả xóa
 */
const hardDeleteBookById = async (data) => {
  const { id } = data
  try {
    await bookModel.hardDelete(id)
    return {
      success: true,
      message: 'Xóa sách vĩnh viễn thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Khôi phục sách đã bị xóa mềm
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {string} data.id - ID của sách
 * @returns {Promise<Object>} Kết quả khôi phục
 */
const restoreBookById = async (data) => {
  const { id } = data
  try {
    await bookModel.restore(id)
    return {
      success: true,
      message: 'Khôi phục sách thành công'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Lấy danh sách sách đã bị xóa mềm
 * @param {Object} data - Dữ liệu yêu cầu
 * @param {Object} data.options - Tùy chọn phân trang
 * @returns {Promise<Object>} Danh sách sách đã xóa
 */
const getDeletedBooks = async (data) => {
  const { options = {} } = data
  try {
    const result = await bookModel.getDeletedBooks(options)
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
 * Lấy thống kê sách
 * @returns {Promise<Object>} Thống kê sách
 */
const getBookStats = async () => {
  try {
    const allBooks = await bookModel.getAll()
    const deletedBooks = await bookModel.getDeletedBooks({})

    const stats = {
      totalBooks: allBooks.length,
      activeBooks: allBooks.length,
      deletedBooks: deletedBooks.books?.length || 0,
      categories: [...new Set(allBooks.map(book => book.category))].length,
      avgRating: allBooks.reduce((sum, book) => sum + (book.avgRating || 0), 0) / allBooks.length || 0
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
  ...bookService,
  hardDeleteBookById,
  restoreBookById,
  getDeletedBooks,
  getBookStats
}
