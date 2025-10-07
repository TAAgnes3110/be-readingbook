const express = require('express')
const validate = require('../middlewares/validate')
const categoriesValidation = require('../validations/categoriesValidation')
const categoriesController = require('../controllers/categoriesController')

const router = express.Router()

// POST /api/categories - Tạo thể loại mới
router.post(
  '/',
  validate(categoriesValidation.create),
  categoriesController.create
)

router.get(
  '/',
  categoriesController.getAll
)

router.get(
  '/current-max-id',
  categoriesController.getCurrentMaxId
)

router.get(
  '/:categoryId',
  validate(categoriesValidation.getById),
  categoriesController.getById
)

router.put(
  '/:categoryId',
  validate(categoriesValidation.update),
  categoriesController.update
)

router.delete(
  '/:categoryId',
  validate(categoriesValidation.delete),
  categoriesController.delete
)

module.exports = router
