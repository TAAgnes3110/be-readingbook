const { catchAsync } = require('../../src/utils/index')
const { bookService } = require('../../src/services/index')

/**
 * Tạo sách mới (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const createBook = catchAsync(async (req, res) => {
  const result = await bookService.createBook({ bookData: req.body })

  if (result.success) {
    res.status(201).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Cập nhật sách (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const updateBook = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await bookService.updateBookById({ id, updateData: req.body })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Xóa mềm sách (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const deleteBook = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await bookService.deleteBookById({ id })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Xóa vĩnh viễn sách (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const hardDeleteBook = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await bookService.hardDeleteBookById({ id })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Khôi phục sách đã bị xóa mềm (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const restoreBook = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await bookService.restoreBookById({ id })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

/**
 * Lấy danh sách sách đã bị xóa mềm (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getDeletedBooks = catchAsync(async (req, res) => {
  const result = await bookService.getDeletedBooks({ options: req.query })

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  hardDeleteBook,
  restoreBook,
  getDeletedBooks
}
