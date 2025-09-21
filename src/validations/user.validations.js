const Joi = require('joi')
const { password } = require('./custom')

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullname: Joi.string().required(),
    customId: Joi.string().required(),
    role: Joi.string().valid('user', 'admin'),
    preferences: Joi.array().items(Joi.string()),
    avatar: Joi.string(),
    isActive: Joi.boolean()
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
  params: Joi.object().keys({
    userId: Joi.string().required()
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

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
}
