const { bookModel } = require('../models/index')

/**
 * Lấy danh sách sách với tìm kiếm và phân trang
 */
const getBooksList = async (data) => {
  const { options = {} } = data || {}
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
}

/**
 * Lấy sách theo ID
 */
const getBookById = async (data) => {
  const { id } = data
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
}

/**
 * Tạo sách mới
 */
const createBook = async (data) => {
  const { bookData } = data
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
}

/**
 * Cập nhật sách
 */
const updateBookById = async (data) => {
  const { id, updateData } = data
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
}

/**
 * Xóa sách
 */
const deleteBookById = async (data) => {
  const { id } = data
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
}

/**
 * Lấy sách mới nhất
 */
const getLatestBooks = async (data) => {
  const { limit = 10 } = data || {}
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
}

/**
 * Lấy ID lớn nhất
 */
const getCurrentMaxBookId = async () => {
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

module.exports = {
  getBooksList,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getLatestBooks,
  getCurrentMaxBookId
}
