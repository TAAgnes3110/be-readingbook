const Joi = require('joi')
const { password } = require('./custom')

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullname: Joi.string().required(),
    phonenumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/),
    role: Joi.string().valid('user', 'admin').default('user')
  })
}

const verifyAndActivateUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    email: Joi.string().required().email(),
    otp: Joi.string().required()
  })
}

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email()
  })
}

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    otp: Joi.string().required(),
    newPassword: Joi.string().required().custom(password)
  })
}

module.exports = {
  register,
  verifyAndActivateUser,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword
}
