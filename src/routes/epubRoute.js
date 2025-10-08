const express = require('express')
const validate = require('../middlewares/validate')
const epubValidation = require('../validations/epubValidation')
const epubController = require('../controllers/epubController')

const router = express.Router()

// EPUB related routes
router.post(
  '/metadata',
  validate(epubValidation.getMetadata),
  epubController.getMetadata
)

router.post(
  '/chapters',
  validate(epubValidation.getChapters),
  epubController.getChapters
)

router.post(
  '/chapter-content',
  validate(epubValidation.getChapterContent),
  epubController.getChapterContent
)

router.post(
  '/validate-url',
  validate(epubValidation.validateUrl),
  epubController.validateUrl
)

// Các tính năng mở rộng
router.post(
  '/chapter-raw',
  validate(epubValidation.getChapterRaw),
  epubController.getChapterRaw
)

router.post(
  '/image',
  validate(epubValidation.getImage),
  epubController.getImage
)

router.post(
  '/file',
  validate(epubValidation.getFile),
  epubController.getFile
)

router.post(
  '/images',
  validate(epubValidation.getMetadata),
  epubController.getImages
)

module.exports = router
