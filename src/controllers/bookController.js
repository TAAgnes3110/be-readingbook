const httpStatus = require('http-status')
const bookService = require('../services/bookService')
const catchAsync = require('../utils/catchAsync')

/**
 * Lấy danh sách sách với tìm kiếm và phân trang
 */
const getList = catchAsync(async (req, res) => {
  const result = await bookService.getBooksList(req.query)
  res.status(httpStatus.OK).json(result)
})

/**
 * Lấy sách theo ID
 */
const getById = catchAsync(async (req, res) => {
  const result = await bookService.getBookById(req.params.id)
  res.status(httpStatus.OK).json(result)
})

/**
 * Tạo sách mới
 */
const create = catchAsync(async (req, res) => {
  const result = await bookService.createBook(req.body)
  res.status(httpStatus.CREATED).json(result)
})

/**
 * Cập nhật sách
 */
const update = catchAsync(async (req, res) => {
  const result = await bookService.updateBookById(req.params.id, req.body)
  res.status(httpStatus.OK).json(result)
})

/**
 * Xóa sách
 */
const deleteBook = catchAsync(async (req, res) => {
  const result = await bookService.deleteBookById(req.params.id)
  res.status(httpStatus.OK).json(result)
})

module.exports = {
  getList,
  getById,
  create,
  update,
  delete: deleteBook
}
