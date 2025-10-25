const express = require('express')
const auth = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const categoriesValidation = require('../validations/categoriesValidation')
const categoriesController = require('../controllers/categoriesController')

const router = express.Router()

router.get(
  '/',
  auth,
  categoriesController.getAll
)


router.get(
  '/:categoryId',
  auth,
  validate(categoriesValidation.getById),
  categoriesController.getById
)

module.exports = router
