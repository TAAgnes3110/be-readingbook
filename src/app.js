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
    limit: config.upload.limit,
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
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
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau'
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
    message: 'Server đang hoạt động bình thường',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API ROUTES
app.use('/api/auth', auth) // Sửa từ auth.route thành auth
app.use('/api/users', user) // Thêm route cho user

// ERROR HANDLER
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error)
  res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Lỗi server nội bộ',
    ...(config.env === 'development' && { stack: error.stack })
  })
})

module.exports = app
