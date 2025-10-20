const {
  getBooksList,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getLatestBooks,
  getCurrentMaxBookId,
  quickSearch
} = require('../services/bookService')

const bookController = {
  /**
   * Lấy danh sách sách (hỗ trợ filter + phân trang)
   * @param {Object} req - HTTP request (query: page, limit, search/q, title, author, keyword, category, status, sortBy, sortOrder)
   * @param {Object} res - HTTP response
   */
  getList: async (req, res) => {
    try {
      const result = await getBooksList({ options: req.query })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy sách theo ID
   * @param {Object} req - HTTP request (params: id)
   * @param {Object} res - HTTP response
   */
  getById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await getBookById({ id })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(404).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Tạo sách mới
   * @param {Object} req - HTTP request (body: thông tin sách)
   * @param {Object} res - HTTP response
   */
  create: async (req, res) => {
    try {
      const result = await createBook({ bookData: req.body })

      if (result.success) {
        res.status(201).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Cập nhật sách theo ID
   * @param {Object} req - HTTP request (params: id, body: dữ liệu cập nhật)
   * @param {Object} res - HTTP response
   */
  update: async (req, res) => {
    try {
      const { id } = req.params
      const result = await updateBookById({ id, updateData: req.body })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Xóa sách theo ID
   * @param {Object} req - HTTP request (params: id)
   * @param {Object} res - HTTP response
   */
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const result = await deleteBookById({ id })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy danh sách sách mới nhất
   * @param {Object} req - HTTP request (query: limit)
   * @param {Object} res - HTTP response
   */
  getLatest: async (req, res) => {
    try {
      const { limit } = req.query
      const parsedLimit = limit ? parseInt(limit) : 10
      const result = await getLatestBooks({ limit: parsedLimit })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },

  /**
   * Lấy ID sách lớn nhất hiện tại
   * @param {Object} req - HTTP request
   * @param {Object} res - HTTP response
   */
  getCurrentMaxId: async (req, res) => {
    try {
      const result = await getCurrentMaxBookId()

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  },
  /**
   * Tìm kiếm sách theo một input duy nhất (title/author/category/description/keywords)
   * @param {Object} req - HTTP request (query: input | q | search, page, limit)
   * @param {Object} res - HTTP response
   */
  search: async (req, res) => {
    try {
      const { input, q, search: searchParam, page, limit } = req.query
      const computedInput = input ?? q ?? searchParam ?? ''
      const result = await quickSearch({ input: computedInput, page, limit })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi server: ${error.message}`
      })
    }
  }
}

module.exports = bookController
