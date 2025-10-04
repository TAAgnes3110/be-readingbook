const httpStatus = require('http-status')
const { ApiError } = require('../utils/index')
const { db } = require('../config/db')
const { generateCustomId } = require('../utils/idUtils')

const categoryModel = {
  /**
   * Tạo thể loại mới
   * @param {Object} categoryData - Dữ liệu thể loại
   * @returns {Promise<Object>} - ID thể loại và thông báo
   * @throws {ApiError} - Nếu dữ liệu không hợp lệ hoặc tạo thất bại
   */
  create: async (categoryData) => {
    try {
      if (!categoryData.name || !categoryData.image_url) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Tên thể loại và ảnh là bắt buộc'
        )
      }

      let categoryId = categoryData._id || categoryData.categoryId
      if (categoryId) {
        const existingCategory = await db.ref(`categories/${categoryId}`).once('value')
        if (existingCategory.val()) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'ID thể loại đã tồn tại'
          )
        }
      }

      const sanitizedData = {
        name: categoryData.name.trim(),
        image_url: categoryData.image_url.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      if (!categoryId) {
        categoryId = generateCustomId('category')
      }

      await db.ref(`categories/${categoryId}`).set({ _id: categoryId, ...sanitizedData })

      return {
        categoryId,
        message: 'Thể loại đã được tạo thành công'
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Tạo thể loại thất bại: ${error.message}`
        )
    }
  },

  /**
   * Lấy tất cả thể loại
   * @returns {Promise<Object>} - Raw categories object
   * @throws {ApiError} - Nếu lấy thất bại
   */
  findAll: async () => {
    try {
      const snapshot = await db.ref('categories').once('value')
      const categories = snapshot.val()

      if (!categories) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Không tìm thấy thể loại'
        )
      }
      return categories
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Lấy tất cả thể loại thất bại: ${error.message}`
        )
    }
  },

  /**
   * Lấy danh sách categories để hiển thị
   * @param {Object} options - Tùy chọn lọc
   * @returns {Promise<Object>} - Formatted categories data
   */
  getAvailableCategories: async (options = {}) => {
    try {
      const { status = 'active', includeInactive = false } = options

      const categories = await categoryModel.findAll()

      let categoriesArray = Object.keys(categories).map(key => ({
        _id: key,
        ...categories[key]
      }))

      if (!includeInactive && status) {
        categoriesArray = categoriesArray.filter(cat =>
          !cat.status || cat.status === status
        )
      }

      return {
        success: true,
        data: {
          categories: categoriesArray,
          message: 'Lấy danh sách thể loại thành công'
        }
      }
    } catch (error) {
      if (error.status === httpStatus.NOT_FOUND) {
        return {
          success: true,
          data: {
            categories: [],
            message: 'Chưa có thể loại nào'
          }
        }
      }
      throw error
    }
  },

  /**
   * Lấy danh sách categories với phân trang và tìm kiếm
   * @param {Object} options - Tùy chọn tìm kiếm và phân trang
   * @returns {Promise<Object>} - Danh sách categories và thông tin phân trang
   */
  getList: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status = 'active',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options

      const { data } = await categoryModel.getAvailableCategories({
        status,
        includeInactive: false
      })
      let categoriesArray = data.categories

      if (search) {
        const searchLower = search.toLowerCase()
        categoriesArray = categoriesArray.filter(cat =>
          cat.name.toLowerCase().includes(searchLower)
        )
      }

      categoriesArray.sort((a, b) => {
        const aValue = a[sortBy] || ''
        const bValue = b[sortBy] || ''
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      const total = categoriesArray.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedCategories = categoriesArray.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          categories: paginatedCategories,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      }
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Lấy danh sách thể loại thất bại: ${error.message}`
      )
    }
  },

  /**
   * Lấy thể loại theo ID
   * @param {string} categoryId - ID thể loại
   * @returns {Promise<Object>} - Đối tượng thể loại
   * @throws {ApiError} - Nếu lấy thất bại
   */
  getById: async (categoryId) => {
    try {
      if (!categoryId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'ID thể loại là bắt buộc'
        )
      }

      const snapshot = await db.ref(`categories/${categoryId}`).once('value')
      const category = snapshot.val()
      if (!category) {
        return null
      }
      return { _id: categoryId, ...category }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Lấy thể loại thất bại: ${error.message}`
        )
    }
  },


  /**
   * Lấy thể loại theo tên
   * @param {string} name - Tên thể loại
   * @returns {Promise<Object>} - Đối tượng thể loại
   * @throws {ApiError} - Nếu lấy thất bại
   */
  findByName: async (name) => {
    try {
      if (!name) {
        throw new ApiError (httpStatus.status.BAD_REQUEST, 'Tên thể loại là bắt buộc')
      }

      const snapshot = await db.ref('categories').orderByChild('name')
        .equalTo(name.trim())
        .once('value')

      const categories = snapshot.val()
      if (!categories) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy thể loại')
      }

      const categoryKeys = Object.keys(categories)
      const firstKey = categoryKeys[0]
      return { _id: firstKey, ...categories[firstKey] }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Lấy thể loại theo tên thất bại: ${error.message}`
        )
    }
  },

  /**
   * Cập nhật thể loại
   * @param {string} categoryId - ID thể loại
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<boolean>} - Trạng thái cập nhật
   * @throws {ApiError} - Nếu cập nhật thất bại
   */
  update: async (categoryId, updateData) => {
    try {
      if (!categoryId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'ID thể loại là bắt buộc'
        )
      }

      const sanitizedUpdateData = {
        updatedAt: Date.now()
      }

      if (updateData.name) {
        sanitizedUpdateData.name = updateData.name.trim()
      }
      if (updateData.image_url) {
        sanitizedUpdateData.image_url = updateData.image_url.trim()
      }

      await db.ref(`categories/${categoryId}`).update(sanitizedUpdateData)
      return true
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Cập nhật thể loại thất bại: ${error.message}`
        )
    }
  },

  /**
   * Xóa thể loại
   * @param {string} categoryId - ID thể loại
   * @returns {Promise<boolean>} - Trạng thái xóa
   * @throws {ApiError} - Nếu xóa thất bại
   */
  delete: async (categoryId) => {
    try {
      if (!categoryId) {
        throw new ApiError(
          httpStatus.status.BAD_REQUEST,
          'ID thể loại là bắt buộc'
        )
      }

      await db.ref(`categories/${categoryId}`).remove()
      return true
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
          httpStatus.status.INTERNAL_SERVER_ERROR,
          `Xóa thể loại thất bại: ${error.message}`
        )
    }
  }
}

module.exports = {
  create: categoryModel.create,
  findAll: categoryModel.findAll,
  getAvailableCategories: categoryModel.getAvailableCategories,
  getList: categoryModel.getList,
  getById: categoryModel.getById,
  findByName: categoryModel.findByName,
  update: categoryModel.update,
  delete: categoryModel.delete
}
