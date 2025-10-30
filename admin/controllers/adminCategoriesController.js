const { catchAsync } = require('../../src/utils/index')
const adminCategoriesService = require('../services/adminCategoriesService')

/**
 * Tạo category mới (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const createCategory = catchAsync(async (req, res) => {
  const result = await adminCategoriesService.createCategory(req.body)
  res.status(201).json(result)
})

/**
 * Cập nhật category (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await adminCategoriesService.updateCategory(categoryId, req.body)
  res.status(200).json(result)
})

/**
 * Xóa mềm category (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await adminCategoriesService.deleteCategory(categoryId)
  res.status(200).json(result)
})

/**
 * Xóa vĩnh viễn category (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const hardDeleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await adminCategoriesService.hardDeleteCategory(categoryId)
  res.status(200).json(result)
})

/**
 * Khôi phục category đã bị xóa mềm (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const restoreCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await adminCategoriesService.restoreCategory(categoryId)
  res.status(200).json(result)
})

/**
 * Lấy danh sách categories đã bị xóa mềm (admin only)
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getDeletedCategories = catchAsync(async (req, res) => {
  const result = await adminCategoriesService.getDeletedCategories({ options: req.query })
  res.status(200).json(result)
})

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
  restoreCategory,
  getDeletedCategories
}
