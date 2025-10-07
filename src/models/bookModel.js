const db = require('../config/db')

const bookModel = {
  /**
   * Lấy tất cả sách
   */
  getAll: async () => {
    try {
      const snapshot = await db.getRef('books').once('value')
      const books = snapshot.val() || {}

      // Chuyển đổi object thành array
      const booksArray = Object.keys(books).map(key => ({
        _id: key,
        ...books[key]
      }))

      return booksArray
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách sách: ${error.message}`)
    }
  },

  /**
   * Lấy sách theo ID
   */
  getById: async (id) => {
    try {
      const snapshot = await db.getRef(`books/${id}`).once('value')
      const book = snapshot.val()

      if (!book) {
        throw new Error('Không tìm thấy sách')
      }

      return { _id: id, ...book }
    } catch (error) {
      throw new Error(`Lỗi khi lấy sách: ${error.message}`)
    }
  },

  /**
   * Tạo sách mới
   */
  create: async (bookData) => {
    try {
      // Tạo ID mới
      const snapshot = await db.getRef('books').once('value')
      const books = snapshot.val() || {}
      const maxId = Math.max(0, ...Object.keys(books).map(Number).filter(id => !isNaN(id)))
      const newId = maxId + 1

      // Lấy ngày hôm nay
      const today = new Date()
      const todayString = today.toISOString().split('T')[0] // Format: YYYY-MM-DD

      const newBook = {
        _id: newId,
        title: bookData.title || '',
        author: bookData.author || '',
        category: bookData.category || null,
        description: bookData.description || '',
        release_date: bookData.release_date || todayString, // Mặc định là ngày hôm nay
        cover_url: bookData.cover_url || '',
        txt_url: bookData.txt_url || '',
        book_url: bookData.book_url || '',
        epub_url: bookData.epub_url || '',
        keywords: bookData.keywords || [],
        status: bookData.status || 'active',
        avgRating: bookData.avgRating || 0,
        numberOfReviews: bookData.numberOfReviews || 0,
        createdAt: today.toISOString(), // Ngày tạo là hôm nay
        updatedAt: today.toISOString()
      }

      await db.getRef(`books/${newId}`).set(newBook)
      return newBook
    } catch (error) {
      throw new Error(`Lỗi khi tạo sách: ${error.message}`)
    }
  },

  /**
   * Cập nhật sách
   */
  update: async (id, updateData) => {
    try {
      // Kiểm tra sách có tồn tại không
      const existingBook = await bookModel.getById(id)
      if (!existingBook) {
        throw new Error('Không tìm thấy sách')
      }

      // Cập nhật dữ liệu
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      }

      await db.getRef(`books/${id}`).update(updatedData)

      // Lấy sách đã cập nhật
      return await bookModel.getById(id)
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật sách: ${error.message}`)
    }
  },

  /**
   * Xóa sách
   */
  delete: async (id) => {
    try {
      // Kiểm tra sách có tồn tại không
      const existingBook = await bookModel.getById(id)
      if (!existingBook) {
        throw new Error('Không tìm thấy sách')
      }

      await db.getRef(`books/${id}`).remove()
      return true
    } catch (error) {
      throw new Error(`Lỗi khi xóa sách: ${error.message}`)
    }
  },

  /**
   * Lấy sách mới nhất
   */
  getLatest: async (limit = 10) => {
    try {
      const allBooks = await bookModel.getAll()

      // Sắp xếp theo ngày tạo mới nhất (createdAt)
      allBooks.sort((a, b) => {
        const dateA = new Date(a.createdAt || '1970-01-01T00:00:00.000Z')
        const dateB = new Date(b.createdAt || '1970-01-01T00:00:00.000Z')
        return dateB - dateA // Sắp xếp giảm dần (mới nhất trước)
      })

      return allBooks.slice(0, limit)
    } catch (error) {
      throw new Error(`Lỗi khi lấy sách mới nhất: ${error.message}`)
    }
  },

  /**
   * Lấy ID lớn nhất
   */
  getMaxId: async () => {
    try {
      const allBooks = await bookModel.getAll()
      if (allBooks.length === 0) return 0

      const maxId = Math.max(...allBooks.map(book => parseInt(book._id) || 0))
      return maxId
    } catch (error) {
      throw new Error(`Lỗi khi lấy ID lớn nhất: ${error.message}`)
    }
  },

  /**
   * Tìm kiếm sách
   */
  search: async (options = {}) => {
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

      let allBooks = await bookModel.getAll()

      // Lọc theo search
      if (search) {
        allBooks = allBooks.filter(book =>
          book.title?.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Lọc theo category
      if (category) {
        allBooks = allBooks.filter(book => book.category == category)
      }

      // Lọc theo status
      if (status) {
        allBooks = allBooks.filter(book => book.status === status)
      }

      // Sắp xếp
      allBooks.sort((a, b) => {
        const aValue = a[sortBy] || ''
        const bValue = b[sortBy] || ''

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      // Phân trang
      const total = allBooks.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedBooks = allBooks.slice(startIndex, endIndex)

      return {
        books: paginatedBooks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm sách: ${error.message}`)
    }
  }
}

module.exports = bookModel
