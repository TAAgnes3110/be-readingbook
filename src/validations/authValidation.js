const Joi = require('joi')
const { password, confirmPassword } = require('./custom')

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().custom(confirmPassword),
    fullName: Joi.string().required(),
    phoneNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/),
    role: Joi.string().valid('user', 'admin').default('user'),
    _id: Joi.number().integer().positive().optional(),
    userId: Joi.number().integer().positive().optional()
  })
}

const verifyAndActivateUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    otp: Joi.string().required()
  })
}

const resendOTP = {
  body: Joi.object().keys({
    email: Joi.string().required().email()
  })
}

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}

module.exports = {
  register,
  verifyAndActivateUser,
  resendOTP,
  login
}
