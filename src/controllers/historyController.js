const historyService = require('../services/historyService')
const { ApiError, catchAsync } = require('../utils/index')
const httpStatus = require('http-status')

const historyController = {
  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {void}
   */
  saveBookmark: catchAsync(async (req, res) => {
    const { userId, bookId, chapterId } = req.body

    // Validate required fields
    if (!userId || !bookId || chapterId === 'null') {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        'ID người dùng, ID sách và chapterId không được để trống'
      )
    }

    const result = await historyService.saveBookmark({
      userId,
      bookId,
      chapterId
    })

    res.status(httpStatus.status.OK).json(result)
  }),

  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {void}
   */
  getReadingHistory: catchAsync(async (req, res) => {
    const { userId } = req.params
    const tokenUserId = req.userId
    const { page, limit, sortBy, sortOrder } = req.query

    // Kiểm tra user chỉ có thể xem lịch sử của chính mình
    if (parseInt(userId) !== parseInt(tokenUserId)) {
      throw new ApiError(
        httpStatus.status.FORBIDDEN,
        'Bạn chỉ có thể xem lịch sử đọc của chính mình'
      )
    }

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || 'lastReadAt',
      sortOrder: sortOrder || 'desc'
    }

    const result = await historyService.getReadingHistory(userId, options)

    res.status(httpStatus.status.OK).json(result)
  }),

  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {void}
   */
  getBookmark: catchAsync(async (req, res) => {
    const { userId, bookId } = req.params
    const tokenUserId = req.userId

    // Kiểm tra user chỉ có thể xem bookmark của chính mình
    if (parseInt(userId) !== parseInt(tokenUserId)) {
      throw new ApiError(
        httpStatus.status.FORBIDDEN,
        'Bạn chỉ có thể xem bookmark của chính mình'
      )
    }

    const result = await historyService.getBookmark(userId, bookId)

    res.status(httpStatus.status.OK).json(result)
  }),

  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {void}
   */
  deleteBookmark: catchAsync(async (req, res) => {
    const { userId, bookId } = req.params
    const tokenUserId = req.userId

    // Kiểm tra user chỉ có thể xóa bookmark của chính mình
    if (parseInt(userId) !== parseInt(tokenUserId)) {
      throw new ApiError(
        httpStatus.status.FORBIDDEN,
        'Bạn chỉ có thể xóa bookmark của chính mình'
      )
    }

    const result = await historyService.deleteBookmark(userId, bookId)

    res.status(httpStatus.status.OK).json(result)
  }),


  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {void}
   */
  getHistoryByUser: catchAsync(async (req, res) => {
    const { userId } = req.params
    const tokenUserId = req.userId

    // Kiểm tra user chỉ có thể xem lịch sử của chính mình
    if (parseInt(userId) !== parseInt(tokenUserId)) {
      throw new ApiError(
        httpStatus.status.FORBIDDEN,
        'Bạn chỉ có thể xem lịch sử đọc của chính mình'
      )
    }

    const result = await historyService.getHistoryByUser(userId)

    res.status(httpStatus.status.OK).json(result)
  }),

  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {void}
   */
  getHistoryByBook: catchAsync(async (req, res) => {
    const { bookId } = req.params

    const result = await historyService.getHistoryByBook(bookId)

    res.status(httpStatus.status.OK).json(result)
  })
}

module.exports = historyController
