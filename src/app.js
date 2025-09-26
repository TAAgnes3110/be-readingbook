const express = require('express')
const cors = require('cors')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const helmet = require('helmet')
const httpStatus = require('http-status')

const { firebaseStrategy } = require('./config/passport')
const config = require('./config/config')
const logger = require('./config/logger')
const auth = require('./routes/authRoute')
const user = require('./routes/userRoute')

const app = express()

// SECURITY MIDDLEWARE
app.use(helmet())
app.use(compression())

// CORS CONFIGURATION
app.use(cors(config.cors))
app.options('*', cors())

// BODY PARSING
app.use(
  express.json({
    limit: config.upload.limit
  })
)
app.use(
  express.urlencoded({
    extended: true,
    limit: config.upload.limit
  })
)

// RATE LIMITING
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

// AUTHENTICATION
app.use(passport.initialize())
passport.use('firebase', firebaseStrategy)

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running normally',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API ROUTES
app.use('/api/auth', auth)
app.use('/api/users', user)

// ERROR HANDLER
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error)

  // More robust status code handling
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR

  if (error && typeof error === 'object') {
    if (typeof error.status === 'number' && error.status >= 100 && error.status <= 599) {
      statusCode = error.status
    } else if (typeof error.statusCode === 'number' && error.statusCode >= 100 && error.statusCode <= 599) {
      statusCode = error.statusCode
    }
  }

  // Ensure response hasn't been sent already
  if (res.headersSent) {
    return next(error)
  }

  // Final safety check
  if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
  }

  try {
    res.status(statusCode).json({
      success: false,
      message: (error && error.message) || 'Internal server error'
    })
  } catch (responseError) {
    logger.error('Failed to send error response:', responseError)
    // If JSON response fails, try plain text
    try {
      res.status(statusCode).send('Internal server error')
    } catch (fallbackError) {
      logger.error('Failed to send fallback response:', fallbackError)
    }
  }
})

module.exports = app
