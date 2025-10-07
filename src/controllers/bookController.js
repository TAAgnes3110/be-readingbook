const bookService = require('../services/bookService')

const bookController = {
  /**
   * Lấy danh sách sách với tìm kiếm và phân trang
   */
  getList: async (req, res) => {
    try {
      const result = await bookService.getBooksList(req.query)

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
   */
  getById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await bookService.getBookById(id)

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
   */
  create: async (req, res) => {
    try {
      const result = await bookService.createBook(req.body)

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
   * Cập nhật sách
   */
  update: async (req, res) => {
    try {
      const { id } = req.params
      const result = await bookService.updateBookById(id, req.body)

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
   * Xóa sách
   */
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const result = await bookService.deleteBookById(id)

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
   * Lấy sách mới nhất
   */
  getLatest: async (req, res) => {
    try {
      const { limit } = req.query
      const parsedLimit = limit ? parseInt(limit) : 10
      const result = await bookService.getLatestBooks(parsedLimit)

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
   * Lấy ID lớn nhất
   */
  getCurrentMaxId: async (req, res) => {
    try {
      const result = await bookService.getCurrentMaxBookId()

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
