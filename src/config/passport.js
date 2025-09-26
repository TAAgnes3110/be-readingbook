const { Strategy } = require('passport-custom')
const { verifyIdToken } = require('./db')
const { getUserById } = require('../services/userService')
const { getAuthError, getUserError } = require('../constants/errorMessages')
const logger = require('./logger')

const firebaseVerify = async (req, done) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return done(null, false, { message: getAuthError('TOKEN_REQUIRED') })
    }

    const idToken = authHeader.substring(7)

    const decodedToken = await verifyIdToken(idToken)

    const user = await getUserById(decodedToken.uid)
    if (!user) {
      return done(null, false, { message: getUserError('USER_NOT_FOUND') })
    }

    user.firebase = {
      uid: decodedToken.uid,
      emailVerified: decodedToken.emailVerified,
      phoneVerified: decodedToken.phoneVerified,
      customClaims: decodedToken.customClaims,
      authTime: decodedToken.authTime
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
