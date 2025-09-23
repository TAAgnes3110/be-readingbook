const { ApiError } = require('../utils/index')
const logger = require('../config/logger')
const { validationResult } = require('express-validator')
const httpStatus = require('http-status')

const error = (err, req, res, next) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR
  let message = 'Lỗi hệ thống'
  let errors = null

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    errors = err.errors
  } else {

    logger.error(`Unexpected error: ${err.stack}`)
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}
