const express = require('express')
const cors = require('cors')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const helmet = require('helmet')
const httpStatus = require('http-status')

const config = require('./config/config')
const logger = require('./config/logger')
const { successHandler, errorHandler } = require('./config/morgan')
const { authRoute, userRoute, categoriesRoute, bookRoute, epubRoute, historyRoute, feedbackRoute } = require('./routes/index')
const { firebaseStrategy } = require('./config/passport')

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
    limit: config.upload.limit || '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  })
)

// Handle JSON parsing for requests without proper Content-Type
app.use((req, res, next) => {
  // Handle text/plain content type that might contain JSON
  if (req.is('text/plain') && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body)
    } catch (e) {
      // If parsing fails, continue with original body
    }
  }

  // Handle requests with no content type that might contain JSON
  if (!req.get('Content-Type') && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body)
    } catch (e) {
      // If parsing fails, continue with original body
    }
  }

  next()
})
app.use(
  express.urlencoded({
    extended: true,
    limit: config.upload.limit || '10mb'
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

// REQUEST LOGGING
app.use(successHandler)
app.use(errorHandler)

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
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/books', bookRoute)
app.use('/api/epub', epubRoute)
app.use('/api/history', historyRoute)
app.use('/api/feedback', feedbackRoute)


// ERROR HANDLER
app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error('Unhandled error:', error)

  let statusCode = error.status || error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR
  if (!statusCode || typeof statusCode !== 'number') {
    statusCode = 500
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error'
  })
})

module.exports = app
