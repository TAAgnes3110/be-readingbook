/**
 * Passport Firebase Auth Strategy configuration
 *
 * - Sử dụng Firebase ID Token để xác thực người dùng
 * - Token được truyền qua Authorization Header dạng: "Bearer <firebase-id-token>"
 * - Xác thực token với Firebase Admin SDK
 * - Sau khi xác thực, lấy thông tin user từ Firebase Auth và Realtime Database
 */

const { Strategy } = require('passport-custom')
const { verifyIdToken } = require('./db')
const { getUserById } = require('../services/userService')
const logger = require('./logger')

/**
 * Hàm verify Firebase ID Token
 * - req: Request object chứa token trong header
 * - done: callback của Passport (done(error, user, info?))
 */
const firebaseVerify = async (req, done) => {
  try {
    // 1. Lấy token từ Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return done(null, false, { message: 'Không tìm thấy token' })
    }

    const idToken = authHeader.substring(7)

    // 2. Xác thực token với Firebase
    const decodedToken = await verifyIdToken(idToken)
    // 3. Lấy thông tin user từ Realtime Database
    const user = await getUserById(decodedToken.uid)
    if (!user) {
      return done(null, false, { message: 'Không tìm thấy user trong database' })
    }

    // 4. Thêm thông tin Firebase vào user object
    user.firebase = {
      uid: decodedToken.uid,
      emailVerified: decodedToken.emailVerified,
      phoneVerified: decodedToken.phoneVerified,
      customClaims: decodedToken.customClaims,
      authTime: decodedToken.authTime
    }

    // 5. Thành công -> trả về user cho Passport
    done(null, user)
  } catch (error) {
    logger.error('Xác thực Firebase Auth thất bại:', error)
    done(error, false, { message: error.message })
  }
}

// Tạo strategy instance
const firebaseStrategy = new Strategy(firebaseVerify)

module.exports = {
  firebaseStrategy
}
