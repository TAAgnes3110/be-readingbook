const Joi = require('joi')

const create = {
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
}

const update = {
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
}

const getById = {
  params: Joi.object().keys({
    categoryId: Joi.string().required().messages({
      'any.required': 'ID thể loại là bắt buộc'
    })
  })
}

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required().messages({
      'any.required': 'ID thể loại là bắt buộc'
    })
  })
}

module.exports = {
  create,
  update,
  getById,
  delete: deleteCategory
}
