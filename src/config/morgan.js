/**
 * HTTP request logger middleware configuration using Morgan + Winston
 *
 * - Morgan: middleware chuyên để log request/response trong Express
 * - Winston: dùng làm logger chính của hệ thống
 * - Ở đây Morgan được cấu hình để ghi log vào Winston thay vì console trực tiếp
 *
 * Có 2 handler:
 *   - successHandler: log request thành công (status < 400)
 *   - errorHandler: log request lỗi (status >= 400), có thêm message chi tiết
 */

const morgan = require('morgan')
const config = require('./config')
const logger = require('./logger')

/**
 * Custom token "message"
 * - Morgan cho phép định nghĩa token riêng
 * - Ở đây token :message sẽ lấy từ res.locals.errorMessage (nếu có)
 * - Thường dùng để log chi tiết lỗi khi response fail
 */
morgan.token('message', (req, res) => res.locals.errorMessage || '')

/**
 * Helper để lấy format IP
 * - Ở môi trường production: log thêm địa chỉ IP (:remote-addr)
 * - Ở development: bỏ qua cho gọn
 */
const getIpFormat = () =>
  config.env === 'production' ? ':remote-addr - ' : ''

/**
 * Format cho log thành công (status < 400)
 * Ví dụ:
 *   GET /api/users 200 - 12 ms
 */
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`

/**
 * Format cho log lỗi (status >= 400)
 * Ví dụ:
 *   GET /api/users 404 - 8 ms - message: User not found
 */
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

/**
 * Middleware log request thành công
 * - skip: bỏ qua log nếu status >= 400
 * - stream: ghi log qua Winston logger.info
 */
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
})

/**
 * Middleware log request lỗi
 * - skip: bỏ qua log nếu status < 400
 * - stream: ghi log qua Winston logger.error
 */
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
})

module.exports = {
  successHandler,
  errorHandler,
}
