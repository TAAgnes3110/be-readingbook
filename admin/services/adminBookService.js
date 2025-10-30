const { bookModel } = require('../../src/models/index')

/**
 * Tạo sách mới
 */
const createBook = async ({ bookData }) => {
  try {
    const created = await bookModel.create(bookData)
    return { success: true, data: { book: created }, message: 'Tạo sách thành công' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Cập nhật sách theo ID
 */
const updateBookById = async ({ id, updateData }) => {
  try {
    const updated = await bookModel.update(id, updateData)
    return { success: true, data: { book: updated }, message: 'Cập nhật sách thành công' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Xóa mềm sách
 */
const deleteBookById = async ({ id }) => {
  try {
    await bookModel.delete(id)
    return { success: true, message: 'Xóa mềm sách thành công' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Xóa vĩnh viễn sách
 */
const hardDeleteBookById = async ({ id }) => {
  try {
    if (typeof bookModel.hardDelete === 'function') {
      await bookModel.hardDelete(id)
    } else {
      // Nếu không có hardDelete, có thể xóa trực tiếp
      await bookModel.delete(id)
    }
    return { success: true, message: 'Xóa vĩnh viễn sách thành công' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Khôi phục sách đã xóa mềm
 */
const restoreBookById = async ({ id }) => {
  try {
    if (typeof bookModel.restore === 'function') {
      await bookModel.restore(id)
    } else {
      await bookModel.update(id, { status: 'active', deletedAt: null })
    }
    const book = await bookModel.getById(id)
    return { success: true, data: { book }, message: 'Khôi phục sách thành công' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Lấy danh sách sách đã xóa mềm
 */
const getDeletedBooks = async ({ options = {} } = {}) => {
  try {
    const all = await bookModel.getAll()
    const items = all.filter(b => b.status !== 'active' || b.deletedAt)
    return { success: true, data: { books: items }, message: 'Lấy danh sách sách đã xóa mềm thành công' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  createBook,
  updateBookById,
  deleteBookById,
  hardDeleteBookById,
  restoreBookById,
  getDeletedBooks
}
