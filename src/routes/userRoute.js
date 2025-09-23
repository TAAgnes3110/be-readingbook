const express = require('express')
const auth = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const userValidation = require('../validations/userValidation')
const userController = require('../controllers/userController')

const router = express.Router()

router
  .route('/')
  .post(auth, validate(userValidation.createUser), userController.createUser)
  .get(auth, validate(userValidation.getUser), userController.getUserByEmail)

router
  .route('/:userId')
  .get(auth, validate(userValidation.getUsers), userController.getUserById)

module.exports = router
