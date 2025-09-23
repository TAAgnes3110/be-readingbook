const { emailProvider } = require('../providers/index')
const config = require('../config/config')
const logger = require('../config/logger')

const getSubject = (type) => {
  const subjects = {
    register: 'Mã xác thực đăng ký - Fliply',
    reset: 'Mã xác thực reset mật khẩu - Fliply',
    update: 'Mã xác thực cập nhật thông tin - Fliply',
    notification: 'Thông báo từ Fliply'
  }
  return subjects[type] || 'Thông báo từ Fliply'
}

const getOTPTemplate = (email, otp, type) => {
  const typeText = {
    register: 'đăng ký',
    reset: 'reset mật khẩu',
    update: 'cập nhật thông tin'
  }
  const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">📚 Fliply</h1>
      <p style="color: #666;">Đọc sách trực tuyến</p>
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
        <h2 style="color: #333;">Mã xác thực ${
  typeText[type] || 'tài khoản'
}</h2>
        <p>Xin chào,</p>
        <p>Bạn đang thực hiện ${
  typeText[type] || 'xác thực'
} tài khoản. Vui lòng sử dụng mã xác thực:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #007bff; color: white; font-size: 32px; font-weight: bold; padding: 20px 40px; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          <strong>Lưu ý:</strong><br>
          • Mã này có hiệu lực trong ${Math.floor(
    config.otp.expiry / 60
  )} phút<br>
          • Không chia sẻ mã này<br>
          • Nếu không yêu cầu, vui lòng bỏ qua
        </p>
      </div>
      <div style="text-align: center; color: #666; font-size: 12px;">
        <p>Email tự động từ Fliply</p>
        <p>Liên hệ: ${config.email.support}</p>
      </div>
    </div>
  `
  logger.debug(`Generated email template for ${email}, type: ${type}`)
  return template
}

async function sendOTP(email, otp, type) {
  try {
    const subject = getSubject(type)
    const html = getOTPTemplate(email, otp, type)
    const result = await emailProvider.send(email, subject, html)
    logger.info(`Sent OTP email to ${email} for ${type}`)
    return result
  } catch (error) {
    logger.error(
      `Failed to send OTP email to ${email} for ${type}: ${error.stack}`
    )
    throw error
  }
}

async function sendNotification(email, subject, content) {
  try {
    const result = await emailProvider.send(email, subject, content)
    logger.info(`Sent notification email to ${email}`)
    return result
  } catch (error) {
    logger.error(
      `Failed to send notification email to ${email}: ${error.stack}`
    )
    throw error
  }
}

module.exports = {
  sendOTP,
  sendNotification
}
