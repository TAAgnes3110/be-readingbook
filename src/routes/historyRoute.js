const express = require('express')
const historyController = require('../controllers/historyController')
const historyValidation = require('../validations/historyValidation')
const validate = require('../middlewares/validate')
const authenticate = require('../middlewares/authMiddleware')

const router = express.Router()

// Save bookmark/reading progress
router.post(
  '/bookmark',
  authenticate,
  validate(historyValidation.saveBookmark),
  historyController.saveBookmark
)

// Get reading history with pagination
router.get(
  '/:userId',
  authenticate,
  validate(historyValidation.getReadingHistory),
  historyController.getReadingHistory
)

// Get specific bookmark
router.get(
  '/:userId/bookmark/:bookId',
  authenticate,
  validate(historyValidation.getBookmark),
  historyController.getBookmark
)

// Delete bookmark
router.delete(
  '/:userId/bookmark/:bookId',
  authenticate,
  validate(historyValidation.deleteBookmark),
  historyController.deleteBookmark
)


// Get all reading history by user ID
router.get(
  '/user/:userId',
  authenticate,
  validate(historyValidation.getHistoryByUser),
  historyController.getHistoryByUser
)

// Get all reading history by book ID (public endpoint)
router.get(
  '/book/:bookId',
  validate(historyValidation.getHistoryByBook),
  historyController.getHistoryByBook
)


module.exports = router
