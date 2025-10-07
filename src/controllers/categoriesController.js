const { catchAsync } = require('../utils/index')
const { categoriesService } = require('../services/index')

/**
 * Tạo thể loại mới
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const create = catchAsync(async (req, res) => {
  const result = await categoriesService.createCategory(req.body)
  res.status(201).json(result)
})

/**
 * Lấy tất cả thể loại
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getAll = catchAsync(async (req, res) => {
  const result = await categoriesService.getAllCategories()
  res.status(200).json(result)
})

/**
 * Lấy thể loại theo ID
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getById = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await categoriesService.getCategoryById(categoryId)
  res.status(200).json(result)
})

/**
 * Cập nhật thể loại
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const update = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await categoriesService.updateCategory(categoryId, req.body)
  res.status(200).json(result)
})

/**
 * Xóa thể loại
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params
  const result = await categoriesService.deleteCategory(categoryId)
  res.status(200).json(result)
})

/**
 * Lấy ID hiện tại lớn nhất của category
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const getCurrentMaxId = catchAsync(async (req, res) => {
  const result = await categoriesService.getCurrentMaxCategoryId()
  res.status(200).json(result)
})

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCategory,
  getCurrentMaxId
}
