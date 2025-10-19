const Joi = require('joi')

/**
 * Validation schemas for category operations
 * @namespace categoriesValidation
 */
const categoriesValidation = {
  /**
   * @param {Object} body - Request body
   * @param {string} body.name - Category name (1-100 characters)
   * @param {string} body.image_url - Category image URL (valid URI)
   * @return {Object} Joi validation schema
   */
  create: {
    body: Joi.object().keys({
      name: Joi.string().required().trim().min(1).max(100).messages({
        'string.empty': 'Tên thể loại không được để trống',
        'any.required': 'Tên thể loại là bắt buộc',
        'string.min': 'Tên thể loại phải có ít nhất 1 ký tự',
        'string.max': 'Tên thể loại không được vượt quá 100 ký tự'
      }),
      image_url: Joi.string().required().uri().messages({
        'string.uri': 'URL ảnh không hợp lệ',
        'any.required': 'URL ảnh là bắt buộc'
      })
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.categoryId - Category ID (required)
   * @param {Object} body - Request body
   * @param {string} [body.name] - Category name (1-100 characters)
   * @param {string} [body.image_url] - Category image URL (valid URI)
   * @param {string} [body.status] - Category status ('active' or 'inactive')
   * @return {Object} Joi validation schema
   */
  update: {
    params: Joi.object().keys({
      categoryId: Joi.string().required().messages({
        'any.required': 'ID thể loại là bắt buộc'
      })
    }),
    body: Joi.object().keys({
      name: Joi.string().trim().min(1).max(100).messages({
        'string.empty': 'Tên thể loại không được để trống',
        'string.min': 'Tên thể loại phải có ít nhất 1 ký tự',
        'string.max': 'Tên thể loại không được vượt quá 100 ký tự'
      }),
      image_url: Joi.string().uri().messages({
        'string.uri': 'URL ảnh không hợp lệ'
      }),
      status: Joi.string().valid('active', 'inactive').messages({
        'any.only': 'Trạng thái không hợp lệ'
      })
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.categoryId - Category ID (required)
   * @return {Object} Joi validation schema
   */
  getById: {
    params: Joi.object().keys({
      categoryId: Joi.string().required().messages({
        'any.required': 'ID thể loại là bắt buộc'
      })
    })
  },

  /**
   * @param {Object} params - URL parameters
   * @param {string} params.categoryId - Category ID (required)
   * @return {Object} Joi validation schema
   */
  delete: {
    params: Joi.object().keys({
      categoryId: Joi.string().required().messages({
        'any.required': 'ID thể loại là bắt buộc'
      })
    })
  }
}

module.exports = categoriesValidation
