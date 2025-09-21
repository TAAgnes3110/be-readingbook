/**
 * Passport JWT Strategy configuration
 *
 * - Sử dụng passport-jwt để xác thực người dùng qua JSON Web Token (JWT)
 * - Token được truyền qua Authorization Header dạng: "Bearer <token>"
 * - Chỉ chấp nhận token loại ACCESS (không dùng refresh/reset/verify cho API call)
 * - Sau khi xác thực, payload trong token được kiểm tra và ánh xạ đến user trong DB
 */

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const config = require('./config')
const { tokenTypes } = require('./token')
const User = require('../models/userModel')

// Các option cho JWT strategy
const jwtOptions = {
  secretOrKey: config.jwt.secret, // Khóa bí mật để verify token (JWT_SECRET trong .env)
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  // => Token sẽ được lấy từ header "Authorization: Bearer <token>"
}

/**
 * Hàm verify JWT payload
 * - payload: dữ liệu bên trong JWT (decoded)
 * - done: callback của Passport (done(error, user, info?))
 */
const jwtVerify = async (payload, done) => {
  try {
    // 1. Chỉ cho phép loại token ACCESS
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type')
    }

    // 2. Lấy user từ DB bằng userId (được lưu ở payload.sub khi tạo token)
    const user = await User.findById(payload.sub)
    if (!user) {
      // Không tìm thấy user -> fail auth
      return done(null, false)
    }

    // 3. Thành công -> trả về user cho Passport
    done(null, user)
  } catch (error) {
    // Nếu verify lỗi (token sai, hết hạn, DB lỗi, ...) -> fail auth
    done(error, false)
  }
}

// Tạo strategy instance
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)

module.exports = {
  jwtStrategy
}
