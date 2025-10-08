const Joi = require('joi')

// EPUB validation schemas
const getMetadata = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    })
  })
}

const getChapters = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    })
  })
}

const getChapterContent = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    }),
    chapter_id: Joi.string().required().trim().min(1).messages({
      'string.empty': 'ID chương không được để trống',
      'any.required': 'ID chương là bắt buộc',
      'string.min': 'ID chương phải có ít nhất 1 ký tự'
    })
  })
}

const validateUrl = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    })
  })
}

const getChapterRaw = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    }),
    chapter_id: Joi.string().required().trim().min(1).messages({
      'string.empty': 'ID chương không được để trống',
      'any.required': 'ID chương là bắt buộc',
      'string.min': 'ID chương phải có ít nhất 1 ký tự'
    })
  })
}

const getImage = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    }),
    image_id: Joi.string().required().trim().min(1).messages({
      'string.empty': 'ID ảnh không được để trống',
      'any.required': 'ID ảnh là bắt buộc',
      'string.min': 'ID ảnh phải có ít nhất 1 ký tự'
    })
  })
}

const getFile = {
  body: Joi.object().keys({
    epub_url: Joi.string().required().uri().messages({
      'string.uri': 'URL EPUB không hợp lệ',
      'any.required': 'URL EPUB là bắt buộc'
    }),
    file_id: Joi.string().required().trim().min(1).messages({
      'string.empty': 'ID file không được để trống',
      'any.required': 'ID file là bắt buộc',
      'string.min': 'ID file phải có ít nhất 1 ký tự'
    })
  })
}

module.exports = {
  getMetadata,
  getChapters,
  getChapterContent,
  validateUrl,
  getChapterRaw,
  getImage,
  getFile
}
