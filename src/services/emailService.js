const { emailProvider } = require('../providers/index')
const config = require('../config/config')
const logger = require('../config/logger')

const getSubject = (type) => {
  const subjects = {
    register: 'Registration Verification Code - Fliply',
    reset: 'Password Reset Verification Code - Fliply',
    update: 'Account Update Verification Code - Fliply',
    notification: 'Notification from Fliply'
  }
  return subjects[type] || 'Notification from Fliply'
}

const getOTPTemplate = (email, otp, type) => {
  const typeText = {
    register: 'registration',
    reset: 'password reset',
    update: 'account update'
  }
  const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">📚 Fliply</h1>
      <p style="color: #666;">Online Reading Platform</p>
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
        <h2 style="color: #333;">Verification Code for ${
  typeText[type] || 'account'
}</h2>
        <p>Hello,</p>
        <p>You are performing ${
  typeText[type] || 'verification'
} for your account. Please use the verification code:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #007bff; color: white; font-size: 32px; font-weight: bold; padding: 20px 40px; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          <strong>Note:</strong><br>
          • This code is valid for ${Math.floor(
    config.otp.expiry / 60
  )} minutes<br>
          • Do not share this code<br>
          • If you did not request this, please ignore
        </p>
      </div>
      <div style="text-align: center; color: #666; font-size: 12px;">
        <p>Automated email from Fliply</p>
        <p>Liên hệ: ${config.email.support}</p>
      </div>
    </div>
  `
  logger.debug(`Generated email template for ${email}, type: ${type}`)
  return template
}

const sendOTP = async (data) => {
  const { email, otp, type } = data
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

const sendNotification = async (data) => {
  const { email, subject, content } = data
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
