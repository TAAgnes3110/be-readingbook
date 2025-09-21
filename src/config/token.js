/**
 * Định nghĩa các loại JWT Token trong hệ thống:
 *
 * - ACCESS: Dùng để xác thực request, TTL = 30 phút
 * - REFRESH: Dùng để cấp phát access token mới khi access token hết hạn, TTL = 30 ngày
 * - RESET_PASSWORD: Dùng khi quên mật khẩu, gửi token qua email để đặt lại mật khẩu, TTL = 10 phút
 * - VERIFY_EMAIL: Dùng khi đăng ký, gửi token qua email để xác thực địa chỉ email, TTL = 10 phút
 */
const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail'
}

module.exports = {
  tokenTypes
}
