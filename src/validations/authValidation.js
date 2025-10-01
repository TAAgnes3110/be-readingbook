const Joi = require('joi')
const { password, confirmPassword } = require('./custom')

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().required().custom(password).messages({
      'any.required': 'Mật khẩu là bắt buộc'
    }),
    confirmPassword: Joi.string().required().custom(confirmPassword).messages({
      'any.required': 'Xác nhận mật khẩu là bắt buộc'
    }),
    fullName: Joi.string().required().messages({
      'any.required': 'Họ tên là bắt buộc'
    }),
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'any.required': 'Số điện thoại là bắt buộc',
        'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
      }),
    role: Joi.string().valid('user', 'admin').default('user').messages({
      'any.only': 'Vai trò phải là user hoặc admin'
    }),
    _id: Joi.number().integer().positive().optional(),
    userId: Joi.number().integer().positive().optional()
  })
}

const verifyOTP = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
    otp: Joi.string().required().messages({
      'any.required': 'Mã OTP là bắt buộc'
    })
  })
}

const resendOTP = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    })
  })
}


const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Mật khẩu là bắt buộc'
    })
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    })
  })
}


const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
    newPassword: Joi.string().required().custom(password).messages({
      'any.required': 'Mật khẩu mới là bắt buộc'
    }),
    confirmPassword: Joi.string().required().custom(confirmPassword).messages({
      'any.required': 'Xác nhận mật khẩu là bắt buộc'
    })
  })
}

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword
}
