const { emailProvider } = require('../providers/index')
const { getErrorMessage } = require('../constants/errorMessages')
const logger = require('../config/logger')

const getSubject = (type) => {
  const subjects = {
    register: '🎉 Mã xác thực đăng ký tài khoản - Fliply',
    update: '⚙️ Mã xác thực cập nhật tài khoản - Fliply',
    notification: '📢 Thông báo từ Fliply'
  }
  return subjects[type] || '📢 Thông báo từ Fliply'
}

const getOTPTemplate = (email, otp, type) => {
  const typeConfig = {
    register: {
      title: 'Xác thực đăng ký tài khoản',
      description: 'Chào mừng bạn đến với Fliply! Vui lòng sử dụng mã xác thực bên dưới để hoàn tất việc đăng ký tài khoản.',
      action: 'đăng ký tài khoản',
      icon: '🎉'
    },
    update: {
      title: 'Cập nhật thông tin tài khoản',
      description: 'Bạn đang thực hiện cập nhật thông tin tài khoản. Vui lòng sử dụng mã xác thực bên dưới để xác nhận.',
      action: 'cập nhật tài khoản',
      icon: '⚙️'
    }
  }

  const config = typeConfig[type] || typeConfig.register

  const template = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">${config.icon} Fliply</h1>
        <p style="color: #7f8c8d; margin: 5px 0 0 0; font-size: 14px;">Nền tảng đọc sách trực tuyến</p>
      </div>

      <!-- Main Content -->
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px; text-align: center;">${config.title}</h2>

        <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Xin chào,</p>

        <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">${config.description}</p>

        <!-- OTP Code -->
        <div style="text-align: center; margin: 40px 0;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: bold; padding: 25px 50px; border-radius: 12px; letter-spacing: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            ${otp}
          </div>
        </div>

        <!-- Instructions -->
        <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">📋 Hướng dẫn:</h3>
          <ul style="color: #34495e; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Mã xác thực có hiệu lực trong <strong>${Math.floor(config.otp?.expiry / 60) || 10} phút</strong></li>
            <li>Không chia sẻ mã này với bất kỳ ai</li>
            <li>Nếu bạn không yêu cầu ${config.action}, vui lòng bỏ qua email này</li>
            <li>Mã chỉ có thể sử dụng một lần</li>
          </ul>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
            <strong>🔒 Bảo mật:</strong> Fliply sẽ không bao giờ yêu cầu bạn cung cấp mật khẩu qua email hoặc tin nhắn.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; color: #7f8c8d; font-size: 12px;">
        <p style="margin: 5px 0;">Email tự động từ Fliply</p>
        <p style="margin: 5px 0;">Liên hệ hỗ trợ: ${config.email?.support || 'support@fliply.com'}</p>
        <p style="margin: 5px 0;">© 2024 Fliply. Tất cả quyền được bảo lưu.</p>
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
    throw new Error(getErrorMessage('EMAIL.SEND_FAILED', `Failed to send OTP email: ${error.message}`))
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
    throw new Error(getErrorMessage('EMAIL.SEND_FAILED', `Failed to send notification email: ${error.message}`))
  }
}


module.exports = {
  sendOTP,
  sendNotification
}
