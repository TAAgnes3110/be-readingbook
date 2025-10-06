const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const { db } = require('../config/db')
const { generateCustomId } = require('../utils/idUtils')
const { categoryModel } = require('./categoryModel')

const bookModel = {

  /**
   * Thêm sách mới
   * @param {Object} bookData - Dữ liệu sách
   * @returns {Promise<Object>} - ID sách và thông báo
   * @throws {ApiError} - Nếu thêm sách thất bại
   */
  create: async (bookData) => {
    try {
      if (
        !bookData.title ||
        !bookData.author ||
        !bookData.category ||
        !bookData.description ||
        !bookData.release_date ||
        !bookData.cover_url ||
        !bookData.txt_url ||
        !bookData.book_url ||
        !bookData.epub_url ||
        !bookData.keywords
      ) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Tất cả các trường là bắt buộc'
        )
      }

      const category = await categoryModel.getById(bookData.category)
      if (!category) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Thể loại không tồn tại'
        )
      }

      if (category.status && category.status !== 'active') {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Thể loại không hoạt động'
        )
      }

      let bookId = bookData._id || bookData.bookId || generateCustomId('book')
      if (bookId) {
        const existingBook = await db.ref(`books/${bookId}`).once('value')
        if (existingBook.val()) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'ID sách đã tồn tại'
          )
        }

        if (isNaN(bookId) || bookId <= 0) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'ID sách phải là số nguyên dương'
          )
        }

        bookId = parseInt(bookId)
      }

      const newBook = {
        _id: bookId,
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        category: bookData.category,
        categoryName: category.name,
        description: bookData.description.trim(),
        release_date: bookData.release_date,
        cover_url: bookData.cover_url,
        txt_url: bookData.txt_url,
        book_url: bookData.book_url,
        epub_url: bookData.epub_url,
        keywords: Array.isArray(bookData.keywords) ? bookData.keywords : bookData.keywords.split(',').map(k => k.trim()),
        status: bookData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await db.ref(`books/${bookId}`).set(newBook)

      return {
        success: true,
        message: 'Thêm sách thành công',
        data: {
          bookId: bookId,
          book: newBook
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Tạo sách thất bại: ${error.message}`
        )
    }
  },

  /**
   * Lấy danh sách sách với phân trang và tìm kiếm
   * @param {Object} options - Tùy chọn tìm kiếm và phân trang
   * @returns {Promise<Object>} - Danh sách sách và thông tin phân trang
   * @throws {ApiError} - Nếu lấy danh sách sách thất bại
   */
  getList: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = '',
        status = 'active',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options

      let booksRef = db.ref('books')

      const snapshot = await booksRef.once('value')
      let books = snapshot.val() || {}

      let booksArray = Object.keys(books).map(key => ({
        _id: key,
        ...books[key]
      }))

      if (status) {
        booksArray = booksArray.filter(book => book.status === status)
      }

      if (category) {
        booksArray = booksArray.filter(book => book.category === category)
      }

      if (search) {
        const searchLower = search.toLowerCase()
        booksArray = booksArray.filter((book) => {
          const titleMatch = book.title?.toLowerCase().includes(searchLower)
          const authorMatch = book.author?.toLowerCase().includes(searchLower)
          const keywordMatch = Array.isArray(book.keywords)
            ? book.keywords.some((k) => k.toLowerCase().includes(searchLower))
            : false

          return titleMatch || authorMatch || keywordMatch
        })
      }

      booksArray.sort((a, b) => {
        const aValue = a[sortBy] || ''
        const bValue = b[sortBy] || ''

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue)
          } else {
            return bValue.localeCompare(aValue)
          }
        }
        return sortOrder === 'asc'
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1
      })

      const total = booksArray.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedBooks = booksArray.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          books: paginatedBooks,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Lấy danh sách sách thất bại: ${error.message}`
        )
    }
  },

  /**
   * Lấy sách theo ID
   * @param {string} bookId - ID sách
   * @returns {Promise<Object>} - Đối tượng sách
   * @throws {ApiError} - Nếu lấy sách thất bại
   */
  getById: async (bookId) => {
    try {
      if (!bookId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'ID sách là bắt buộc'
        )
      }
      const snapshot = await db.ref(`books/${bookId}`).once('value')
      const book = snapshot.val()

      if (!book) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Không tìm thấy sách'
        )
      }

      return {
        success: true,
        data: {
          book: {
            _id: bookId,
            ...book
          }
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
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
  update: async (bookId, updateData) => {
    try {
      if (!bookId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'ID sách là bắt buộc'
        )
      }

      const existingBook = await db.ref(`books/${bookId}`).once('value')
      if (!existingBook.val()) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Không tìm thấy sách'
        )
      }

      const allowedFields = [
        'title', 'author', 'category', 'description',
        'release_date', 'cover_url', 'txt_url',
        'book_url', 'epub_url', 'keywords', 'status',
        'avgRating', 'numberOfReviews']

      const updateFields = {}
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          if (key === 'keywords') {
            updateFields['keywords'] = Array.isArray(updateData[key])
              ? updateData[key]
              : updateData[key].split(',').map(k => k.trim())
          } else if (typeof updateData[key] === 'string') {
            updateFields[key] = updateData[key].trim()
          } else {
            updateFields[key] = updateData[key]
          }
        }
      })

      updateFields.updatedAt = new Date().toISOString()

      await db.ref(`books/${bookId}`).update(updateFields)

      const updatedSnapshot = await db.ref(`books/${bookId}`).once('value')
      const updatedBook = updatedSnapshot.val()

      return {
        success: true,
        data: {
          book: {
            _id: bookId,
            ...updatedBook
          }
        }
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
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
          httpStatus.BAD_REQUEST,
          'ID sách là bắt buộc'
        )
      }

      const existingBook = await db.ref(`books/${bookId}`).once('value')
      if (!existingBook.val()) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Không tìm thấy sách'
        )
      }

      await db.ref(`books/${bookId}`).remove()

      return {
        success: true,
        message: 'Xóa sách thành công'
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Xóa sách thất bại: ${error.message}`
        )
    }
  },

  //get new book
}

module.exports = { bookModel }
