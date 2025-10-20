const express = require('express')
const validate = require('../middlewares/validate')
const bookValidation = require('../validations/bookValidation')
const bookController = require('../controllers/bookController')

const router = express.Router()

// Bỏ qua route `/:id` nếu tham số id không phải là số
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return next('route')
  next()
})

router.get(
  '/',
  validate(bookValidation.getList),
  bookController.getList
)

router.get(
  '/latest',
  validate(bookValidation.getLatest),
  bookController.getLatest
)

router.get(
  '/current-max-id',
  bookController.getCurrentMaxId
)

router.get(
  '/:id',
  validate(bookValidation.getById),
  bookController.getById
)

router.post(
  '/',
  validate(bookValidation.create),
  bookController.create
)

router.put(
  '/:id',
  validate(bookValidation.update),
  bookController.update
)

router.delete(
  '/:id',
  validate(bookValidation.delete),
  bookController.delete
)


router.get(
  '/search',
  validate(bookValidation.quickSearch),
  bookController.search
)

module.exports = router
