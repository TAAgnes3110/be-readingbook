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

router
  .route('/:userId/favorites')
  .get(auth, validate(userValidation.getFavoriteBooks), userController.getFavoriteBooks)

router
  .route('/:userId/favorites/:bookId')
  .post(auth, validate(userValidation.addFavoriteBook), userController.addFavoriteBook)
  .delete(auth, validate(userValidation.removeFavoriteBook), userController.removeFavoriteBook)

module.exports = router
