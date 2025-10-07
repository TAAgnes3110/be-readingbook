const bookModel = require('../models/bookModel')

const bookService = {
  /**
   * Lấy danh sách sách với tìm kiếm và phân trang
   */
  getBooksList: async (options = {}) => {
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
  },

  /**
   * Lấy sách theo ID
   */
  getBookById: async (id) => {
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
  },

  /**
   * Tạo sách mới
   */
  createBook: async (bookData) => {
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
  },

  /**
   * Cập nhật sách
   */
  updateBookById: async (id, updateData) => {
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
  },

  /**
   * Xóa sách
   */
  deleteBookById: async (id) => {
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
  },

  /**
   * Lấy sách mới nhất
   */
  getLatestBooks: async (limit = 10) => {
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
  },

  /**
   * Lấy ID lớn nhất
   */
  getCurrentMaxBookId: async () => {
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
}

module.exports = bookService