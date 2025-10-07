const Joi = require('joi')

const getList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Trang phải là số',
      'number.integer': 'Trang phải là số nguyên',
      'number.min': 'Trang phải lớn hơn 0'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Giới hạn phải là số',
      'number.integer': 'Giới hạn phải là số nguyên',
      'number.min': 'Giới hạn phải lớn hơn 0',
      'number.max': 'Giới hạn không được vượt quá 100'
    }),
    search: Joi.string().allow('').optional().messages({
      'string.base': 'Từ khóa tìm kiếm phải là chuỗi'
    }),
    category: Joi.string().allow('').optional().messages({
      'string.base': 'Thể loại phải là chuỗi'
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
      'any.only': 'Trạng thái phải là active hoặc inactive'
    }),
    sortBy: Joi.string().valid('title', 'author', 'createdAt', 'updatedAt').default('createdAt').messages({
      'any.only': 'Sắp xếp theo phải là title, author, createdAt hoặc updatedAt'
    }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
      'any.only': 'Thứ tự sắp xếp phải là asc hoặc desc'
    })
  })
}

const getById = {
  params: Joi.object().keys({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'ID sách phải là số',
      'number.integer': 'ID sách phải là số nguyên',
      'number.positive': 'ID sách phải là số dương',
      'any.required': 'ID sách là bắt buộc'
    })
  })
}

const create = {
  body: Joi.object().keys({
    title: Joi.string().required().trim().min(1).max(200).messages({
      'string.empty': 'Tên sách không được để trống',
      'any.required': 'Tên sách là bắt buộc',
      'string.min': 'Tên sách phải có ít nhất 1 ký tự',
      'string.max': 'Tên sách không được vượt quá 200 ký tự'
    }),
    author: Joi.string().required().trim().min(1).max(100).messages({
      'string.empty': 'Tác giả không được để trống',
      'any.required': 'Tác giả là bắt buộc',
      'string.min': 'Tác giả phải có ít nhất 1 ký tự',
      'string.max': 'Tác giả không được vượt quá 100 ký tự'
    }),
    category: Joi.number().integer().positive().required().messages({
      'number.base': 'Thể loại phải là số',
      'number.integer': 'Thể loại phải là số nguyên',
      'number.positive': 'Thể loại phải là số dương',
      'any.required': 'Thể loại là bắt buộc'
    }),
    description: Joi.string().required().trim().min(10).max(2000).messages({
      'string.empty': 'Mô tả không được để trống',
      'any.required': 'Mô tả là bắt buộc',
      'string.min': 'Mô tả phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả không được vượt quá 2000 ký tự'
    }),
    release_date: Joi.date().required().messages({
      'date.base': 'Ngày phát hành không hợp lệ',
      'any.required': 'Ngày phát hành là bắt buộc'
    }),
    cover_url: Joi.string().required().uri().messages({
      'string.uri': 'URL ảnh bìa không hợp lệ',
      'any.required': 'URL ảnh bìa là bắt buộc'
    }),
    txt_url: Joi.string().required().uri().messages({
      'string.uri': 'URL file txt không hợp lệ',
      'any.required': 'URL file txt là bắt buộc'
    }),
    book_url: Joi.string().required().uri().messages({
      'string.uri': 'URL sách không hợp lệ',
      'any.required': 'URL sách là bắt buộc'
    }),
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL file epub không hợp lệ',
      'any.required': 'URL file epub là bắt buộc'
    }),
    keywords: Joi.alternatives().try(
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(10),
      Joi.string().trim().min(1)
    ).required().messages({
      'any.required': 'Từ khóa là bắt buộc',
      'array.min': 'Phải có ít nhất 1 từ khóa',
      'array.max': 'Không được vượt quá 10 từ khóa',
      'string.min': 'Từ khóa phải có ít nhất 1 ký tự'
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
      'any.only': 'Trạng thái phải là active hoặc inactive'
    }),
    avgRating: Joi.number().min(0).max(5).optional().messages({
      'number.min': 'Đánh giá trung bình phải từ 0 đến 5',
      'number.max': 'Đánh giá trung bình phải từ 0 đến 5'
    }),
    numberOfReviews: Joi.number().integer().min(0).optional().messages({
      'number.integer': 'Số lượng đánh giá phải là số nguyên',
      'number.min': 'Số lượng đánh giá phải lớn hơn hoặc bằng 0'
    }),
    _id: Joi.number().integer().positive().optional(),
    bookId: Joi.number().integer().positive().optional()
  })
}

const update = {
  params: Joi.object().keys({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'ID sách phải là số',
      'number.integer': 'ID sách phải là số nguyên',
      'number.positive': 'ID sách phải là số dương',
      'any.required': 'ID sách là bắt buộc'
    })
  }),
  body: Joi.object().keys({
    title: Joi.string().trim().min(1).max(200).optional().messages({
      'string.empty': 'Tên sách không được để trống',
      'string.min': 'Tên sách phải có ít nhất 1 ký tự',
      'string.max': 'Tên sách không được vượt quá 200 ký tự'
    }),
    author: Joi.string().trim().min(1).max(100).optional().messages({
      'string.empty': 'Tác giả không được để trống',
      'string.min': 'Tác giả phải có ít nhất 1 ký tự',
      'string.max': 'Tác giả không được vượt quá 100 ký tự'
    }),
    category: Joi.number().integer().positive().optional().messages({
      'number.base': 'Thể loại phải là số',
      'number.integer': 'Thể loại phải là số nguyên',
      'number.positive': 'Thể loại phải là số dương'
    }),
    description: Joi.string().trim().min(10).max(2000).optional().messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả không được vượt quá 2000 ký tự'
    }),
    release_date: Joi.date().optional().messages({
      'date.base': 'Ngày phát hành không hợp lệ'
    }),
    cover_url: Joi.string().uri().optional().messages({
      'string.uri': 'URL ảnh bìa không hợp lệ'
    }),
    txt_url: Joi.string().uri().optional().messages({
      'string.uri': 'URL file txt không hợp lệ'
    }),
    book_url: Joi.string().uri().optional().messages({
      'string.uri': 'URL sách không hợp lệ'
    }),
    epub_url: Joi.string().uri().optional().messages({
      'string.uri': 'URL file epub không hợp lệ'
    }),
    keywords: Joi.alternatives().try(
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(10),
      Joi.string().trim().min(1)
    ).optional().messages({
      'array.min': 'Phải có ít nhất 1 từ khóa',
      'array.max': 'Không được vượt quá 10 từ khóa',
      'string.min': 'Từ khóa phải có ít nhất 1 ký tự'
    }),
    status: Joi.string().valid('active', 'inactive').optional().messages({
      'any.only': 'Trạng thái phải là active hoặc inactive'
    }),
    avgRating: Joi.number().min(0).max(5).optional().messages({
      'number.min': 'Đánh giá trung bình phải từ 0 đến 5',
      'number.max': 'Đánh giá trung bình phải từ 0 đến 5'
    }),
    numberOfReviews: Joi.number().integer().min(0).optional().messages({
      'number.integer': 'Số lượng đánh giá phải là số nguyên',
      'number.min': 'Số lượng đánh giá phải lớn hơn hoặc bằng 0'
    })
  }).min(1).messages({
    'object.min': 'Phải cung cấp ít nhất 1 trường để cập nhật'
  })
}

const deleteBook = {
  params: Joi.object().keys({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'ID sách phải là số',
      'number.integer': 'ID sách phải là số nguyên',
      'number.positive': 'ID sách phải là số dương',
      'any.required': 'ID sách là bắt buộc'
    })
  })
}

const getLatest = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Limit phải là số',
      'number.integer': 'Limit phải là số nguyên',
      'number.min': 'Limit phải lớn hơn 0',
      'number.max': 'Limit không được vượt quá 50'
    })
  })
}

module.exports = {
  getList,
  getById,
  create,
  update,
  delete: deleteBook,
  getLatest
}
