const express = require('express')
const auth = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const bookValidation = require('../validations/bookValidation')
const bookController = require('../controllers/bookController')

const router = express.Router()

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return next('route')
  next()
})

router.get(
  '/',
  auth,
  validate(bookValidation.getList),
  bookController.getList
)

router.get(
  '/latest',
  auth,
  validate(bookValidation.getLatest),
  bookController.getLatest
)


router.get(
  '/:id',
  auth,
  validate(bookValidation.getById),
  bookController.getById
)

router.get(
  '/search',
  auth,
  validate(bookValidation.quickSearch),
  bookController.search
)

module.exports = router
