const express = require('express')
const validate = require('../middlewares/validate')
const authValidation = require('../validations/authValidation')
const authController = require('../controllers/authController')

const router = express.Router()

router.post(
  '/register',
  validate(authValidation.register),
  authController.register
)

router.post(
  '/verify-otp',
  validate(authValidation.verifyAndActivateUser),
  authController.verifyOTP
)

router.post(
  '/resend-otp',
  validate(authValidation.resendOTP),
  authController.resendOTP
)

router.post(
  '/login',
  validate(authValidation.login),
  authController.login
)

module.exports = router
