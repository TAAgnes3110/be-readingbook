const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: process.env.NODE_ENV,
  app: {
    name: process.env.APP_NAME,
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    apiVersion: process.env.API_VERSION,
    prefix: process.env.API_PREFIX
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    projectNumber: process.env.FIREBASE_PROJECT_NUMBER,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes:
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    },
    from: process.env.EMAIL_FROM
  },
  upload: {
    limit: process.env.UPLOAD_LIMIT,
    allowedFormats: process.env.ALLOWED_FORMATS.split(','),
    storagePath: process.env.STORAGE_PATH
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT, 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000
  },
  logging: {
    level: process.env.LOG_LEVEL,
    format: process.env.LOG_FORMAT
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS.split(','),
    credentials: process.env.CORS_CREDENTIALS === 'true'
  }
}
