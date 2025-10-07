const db = require('../config/db')
const { ApiError } = require('../utils/index')
const httpStatus = require('http-status')

const bookModel = {
  /**
   * Lấy ID hiện tại của book và tạo ID mới
   * @returns {Promise<number>} - ID mới cho book
   */
  getNextBookId: async () => {
    try {
      // Lấy tất cả books để tìm ID lớn nhất
      const snapshot = await db.getRef('books').once('value')
      const books = snapshot.val()

      if (!books || Object.keys(books).length === 0) {
        // Nếu chưa có book nào, bắt đầu từ 1
        return 1
      }

      // Tìm ID lớn nhất
      let maxId = 0
      Object.keys(books).forEach(key => {
        const id = parseInt(key, 10)
        if (!isNaN(id) && id > maxId) {
          maxId = id
        }
      })

      // Trả về ID tiếp theo
      return maxId + 1
    } catch (error) {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Lỗi khi tạo ID mới cho book: ${error.message}`
      )
    }
  },

  /**
   * Lấy ID hiện tại lớn nhất của book (không tạo mới)
   * @returns {Promise<number>} - ID hiện tại lớn nhất
   */
  getCurrentMaxBookId: async () => {
    try {
      // Lấy tất cả books để tìm ID lớn nhất
      const snapshot = await db.getRef('books').once('value')
      const books = snapshot.val()

      if (!books || Object.keys(books).length === 0) {
        // Nếu chưa có book nào, trả về 0
        return 0
      }

      // Tìm ID lớn nhất
      let maxId = 0
      Object.keys(books).forEach(key => {
        const id = parseInt(key, 10)
        if (!isNaN(id) && id > maxId) {
          maxId = id
        }
      })

      return maxId
    } catch (error) {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Lỗi khi lấy ID hiện tại của book: ${error.message}`
      )
    }
  },

  /**
   * Tạo sách mới
   * @param {Object} bookData - Dữ liệu sách
   * @returns {Promise<Object>} - ID sách và thông báo
   * @throws {ApiError} - Nếu dữ liệu không hợp lệ hoặc tạo thất bại
   */
  create: async (bookData) => {
    try {
      if (
        !bookData.title ||
        !bookData.author ||
        !bookData.genres ||
        !bookData.description ||
        !bookData.release_data ||
        !bookData.cover_url ||
        !bookData.txt_url ||
        !bookData.book_url ||
        !bookData.epub_url ||
        !bookData.keywords ||
        !bookData.avgRating ||
        !bookData.numberOfRatings
      ) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'Tất cả các trường là bắt buộc'
        )
      }

      // Tạo ID mới cho book
      const bookId = await bookModel.getNextBookId()

      const newBook = {
        _id: bookId,
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        genres: bookData.genres,
        description: bookData.description.trim(),
        release_data: bookData.release_data,
        cover_url: bookData.cover_url.trim(),
        txt_url: bookData.txt_url.trim(),
        book_url: bookData.book_url.trim(),
        epub_url: bookData.epub_url.trim(),
        keywords: bookData.keywords,
        avgRating: bookData.avgRating,
        numberOfRatings: bookData.numberOfRatings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Lưu vào Firebase
      await db.getRef(`books/${bookId}`).set(newBook)

      return {
        bookId,
        message: 'Sách đã được tạo thành công'
      }
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Tạo sách thất bại: ${error.message}`
      )
    }
  },

  /**
   * Lấy tất cả sách
   * @returns {Promise<Object>} - Đối tượng sách
   */
  findAll: async () => {
    try {
      const snapshot = await db.getRef('books').once('value')
      const books = snapshot.val()
      return books || {}
    } catch (error) {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Lấy tất cả sách thất bại: ${error.message}`
      )
    }
  },

  /**
   * Lấy sách theo ID
   * @param {string} bookId - ID sách
   * @returns {Promise<Object>} - Đối tượng sách
   * @throws {ApiError} - Nếu không tìm thấy sách
   */
  findById: async (bookId) => {
    try {
      if (!bookId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'ID sách là bắt buộc'
        )
      }

      const snapshot = await db.getRef(`books/${bookId}`).once('value')
      const book = snapshot.val()
      if (!book) {
        throw new ApiError(
          httpStatus.status.NOT_FOUND,
          'Không tìm thấy sách'
        )
      }
      return { _id: bookId, ...book }
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Lấy sách thất bại: ${error.message}`
      )
    }
  },

  /**
   * Cập nhật sách
   * @param {string} bookId - ID sách
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<boolean>} - Trạng thái cập nhật
   * @throws {ApiError} - Nếu cập nhật thất bại
   */
  update: async (bookId) => {
    try {
      if (!bookId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'ID sách là bắt buộc'
        )
      }

      const sanitizedUpdateData = {
        updatedAt: Date.now()
      }

      await db.getRef(`books/${bookId}`).update(sanitizedUpdateData)
      return true
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Cập nhật sách thất bại: ${error.message}`
      )
    }
  },

  /**
   * Xóa sách
   * @param {string} bookId - ID sách
   * @returns {Promise<boolean>} - Trạng thái xóa
   * @throws {ApiError} - Nếu xóa thất bại
   */
  delete: async (bookId) => {
    try {
      if (!bookId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'ID sách là bắt buộc'
        )
      }

      await db.getRef(`books/${bookId}`).remove()
      return true
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Xóa sách thất bại: ${error.message}`
      )
    }
  }
}
