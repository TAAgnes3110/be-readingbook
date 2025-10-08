const Joi = require('joi')
const { password } = require('./custom')

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullname: Joi.string().required(),
    username: Joi.string().required().min(3).max(30),
    phonenumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10,11}$/),
    role: Joi.string().valid('user', 'admin').default('user'),
    preferences: Joi.array().items(Joi.string()),
    avatar: Joi.string()
  })
}

const verifyUserOTP = {
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

const requestResetPassword = {
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

const getUsers = {
  query: Joi.object().keys({
    fullname: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const getUser = {
  query: Joi.object().keys({
    email: Joi.string().required().email()
  })
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      fullname: Joi.string(),
      username: Joi.string().min(3).max(30),
      phonenumber: Joi.string().pattern(/^[0-9]{10,11}$/),
      preferences: Joi.array().items(Joi.string()),
      avatar: Joi.string(),
      isActive: Joi.boolean()
    })
    .min(1)
}

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
}

const addFavoriteBook = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
    bookId: Joi.string().required()
  })
}

const removeFavoriteBook = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
    bookId: Joi.string().required()
  })
}

const getFavoriteBooks = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
}

module.exports = {
  createUser,
  verifyUserOTP,
  login,
  requestResetPassword,
  resetPassword,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addFavoriteBook,
  removeFavoriteBook,
  getFavoriteBooks
}
