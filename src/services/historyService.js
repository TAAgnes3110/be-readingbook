const historyModel = require('../models/historyModel')
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const { ApiError } = require('../utils/index')
const httpStatus = require('http-status')
const epubService = require('./epubService')

const historyService = {
  /**
   * @param {Object} bookmarkData - Bookmark data
   * @return {Object} Save result
   */
  saveBookmark: async (bookmarkData) => {
    try {
      const { userId, bookId, chapterId } = bookmarkData

      // Validate user exists
      await userModel.findById(userId)

      // Validate book exists
      await bookModel.getById(bookId)

      if (chapterId === 'null') {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'ChapterId là bắt buộc'
        )
      }

      await epubService.getEpubChapterRaw({ url: bookModel.epub_url, chapterId: chapterId })

      const existingHistory = await historyModel.findByUserAndBook(userId, bookId)

      const updateData = {
        chapterId,
        lastReadAt: Date.now()
      }


      if (existingHistory) {
        // Update existing history
        const updatedHistory = await historyModel.update(existingHistory._id, updateData)

        // Remove page property from response
        // eslint-disable-next-line no-unused-vars
        const { page, ...historyWithoutPage } = updatedHistory
        return {
          success: true,
          message: 'Bookmark đã được cập nhật thành công',
          data: historyWithoutPage
        }
      } else {
        // Create new history
        const newHistory = await historyModel.create({
          userId,
          bookId,
          ...updateData
        })

        // Get the created history without page property
        const createdHistory = await historyModel.findById(newHistory.historyId)
        // eslint-disable-next-line no-unused-vars
        const { page, ...historyWithoutPage } = createdHistory
        return {
          success: true,
          message: 'Bookmark đã được lưu thành công',
          data: historyWithoutPage
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Lưu bookmark thất bại: ${error.message}`
        )
    }
  },

  /**
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @return {Object} Reading history result
   */
  getReadingHistory: async (userId, options = {}) => {
    try {
      // Validate user exists
      await userModel.findById(userId)

      // Get reading history
      const historyResult = await historyModel.getByUserId(userId, options)
      const { histories, pagination } = historyResult

      // Get detailed book information for each history
      const historiesWithBooks = await Promise.all(
        histories.map(async (history) => {
          try {
            const book = await bookModel.getById(history.bookId)
            return {
              ...history,
              book: {
                _id: book._id,
                title: book.title,
                author: book.author,
                cover_url: book.cover_url,
                category: book.category
              }
            }
          } catch (error) {
            // If book not found, return history without book info
            return {
              ...history,
              book: null
            }
          }
        })
      )

      return {
        success: true,
        message: 'Lấy lịch sử đọc sách thành công',
        data: {
          histories: historiesWithBooks,
          pagination
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Lấy lịch sử đọc sách thất bại: ${error.message}`
        )
    }
  },

  /**
   * @param {number} userId - User ID
   * @param {number} bookId - Book ID
   * @return {Object} Bookmark result
   */
  getBookmark: async (userId, bookId) => {
    try {
      // Validate user exists
      await userModel.findById(userId)

      // Validate book exists
      const book = await bookModel.getById(bookId)

      // Find bookmark
      const history = await historyModel.findByUserAndBook(userId, bookId)

      if (!history) {
        return {
          success: true,
          message: 'Chưa có bookmark cho cuốn sách này',
          data: {
            bookId: parseInt(bookId),
            page: 1,
            lastReadAt: null,
            book: {
              _id: book._id,
              title: book.title,
              author: book.author,
              cover_url: book.cover_url
            }
          }
        }
      }

      return {
        success: true,
        message: 'Lấy bookmark thành công',
        data: {
          ...history,
          book: {
            _id: book._id,
            title: book.title,
            author: book.author,
            cover_url: book.cover_url
          }
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Lấy bookmark thất bại: ${error.message}`
        )
    }
  },

  /**
   * @param {number} userId - User ID
   * @param {number} bookId - Book ID
   * @return {Object} Delete result
   */
  deleteBookmark: async (userId, bookId) => {
    try {
      // Kiểm tra user có tồn tại không
      await userModel.findById(userId)

      // Tìm bookmark
      const history = await historyModel.findByUserAndBook(userId, bookId)

      if (!history) {
        throw new ApiError(
          httpStatus.status.NOT_FOUND,
          'Không tìm thấy bookmark cho cuốn sách này'
        )
      }

      // Xóa bookmark
      await historyModel.delete(history._id)

      return {
        success: true,
        message: 'Xóa bookmark thành công'
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Xóa bookmark thất bại: ${error.message}`
        )
    }
  },

  /**
   * @param {number} userId - User ID
   * @return {Object} History by user result
   */
  getHistoryByUser: async (userId) => {
    try {
      // Kiểm tra user có tồn tại không
      await userModel.findById(userId)

      // Tìm tất cả lịch sử đọc của user
      const historyResult = await historyModel.getByUserId(userId)
      const histories = historyResult.histories

      return {
        success: true,
        message: `Lấy lịch sử đọc của user ${userId} thành công`,
        data: histories,
        count: histories.length
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Lấy lịch sử đọc theo user thất bại: ${error.message}`
        )
    }
  },

  /**
   * @param {number} bookId - Book ID
   * @return {Object} History by book result
   */
  getHistoryByBook: async (bookId) => {
    try {
      // Kiểm tra book có tồn tại không
      await bookModel.getById(bookId)

      // Tìm tất cả lịch sử đọc của book
      const histories = await historyModel.findByBook(bookId)

      return {
        success: true,
        message: `Lấy lịch sử đọc của book ${bookId} thành công`,
        data: histories,
        count: histories.length
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Lấy lịch sử đọc theo book thất bại: ${error.message}`
        )
    }
  }
}

module.exports = {
  saveBookmark: historyService.saveBookmark,
  getReadingHistory: historyService.getReadingHistory,
  getBookmark: historyService.getBookmark,
  deleteBookmark: historyService.deleteBookmark,
  getHistoryByUser: historyService.getHistoryByUser,
  getHistoryByBook: historyService.getHistoryByBook
}

