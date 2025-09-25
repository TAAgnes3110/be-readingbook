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
    // Client config ẩn tạm thời - chỉ cần cho backend logic
    // apiKey: process.env.FIREBASE_API_KEY,
    // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.FIREBASE_APP_ID
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
  },
  otp: {
    length: parseInt(process.env.OTP_LENGTH, 10) || 6,
    expiry: parseInt(process.env.OTP_EXPIRY, 10) || 300,
    provider: process.env.OTP_PROVIDER || 'email'
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300, // 5 minutes
    checkperiod: parseInt(process.env.CACHE_CHECKPERIOD, 10) || 120 // 2 minutes
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY
  }
}
