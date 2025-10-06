const { Strategy } = require('passport-custom')
const { auth } = require('./db')
const { getUserById } = require('../services/userService')
const logger = require('./logger')

const firebaseVerify = async (req, done) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return done(null, false, { message: 'Token not found' })
    }

    const idToken = authHeader.substring(7)

    const decodedToken = await auth.verifyIdToken(idToken)

    const user = await getUserById(decodedToken.uid)
    if (!user) {
      return done(null, false, { message: 'User not found in database' })
    }

    user.firebase = {
      uid: decodedToken.uid,
      emailVerified: decodedToken.email_verified,
      phoneVerified: decodedToken.phone_number_verified,
      customClaims: decodedToken.custom_claims,
      authTime: decodedToken.auth_time
    }

    done(null, user)
  } catch (error) {
    logger.error('Firebase Auth verification failed:', error)
    done(error, false, { message: error.message })
  }
}

const firebaseStrategy = new Strategy(firebaseVerify)

module.exports = {
  firebaseStrategy
}
