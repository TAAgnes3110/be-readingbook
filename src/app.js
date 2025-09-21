const express = require('express')
const cors = require('cors')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const { jwtStrategy } = require('./config/passport')
const routes = require('./routes/users_routes')
const config = require('./config/config')
const morgan = require('./config/morgan')
// const { errorConverter, errorHandler } = require("./middlewares/error");

const app = express()

// // logging
// if (config.env !== "test") {
//   app.use(morgan.successHandler);
//   app.use(morgan.errorHandler);
// }

// parse json request body
app.use(express.json({ limit: config.upload.limit }))
app.use(express.urlencoded({ extended: true, limit: config.upload.limit }))

// enable cors
app.use(cors(config.cors))
app.options('*', cors())

// jwt authentication
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max
  })
)

// api routes
// app.use(config.app.prefix, routes)

// error handling
// app.use(errorConverter);
// app.use(errorHandler);

module.exports = app
