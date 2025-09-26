const nodemailer = require('nodemailer')
const { getErrorMessage } = require('../constants/errorMessages')
const config = require('../config/config')
const logger = require('../config/logger')

let transporter = null

/**
 * Initialize email transporter from config
 */
function initialize() {
  if (config.email.smtp.host && config.email.smtp.auth.user) {
    transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass
      }
    })
    logger.info('Email transporter initialized')
  } else {
    logger.warn('Email SMTP configuration missing')
  }
}

/**
 * Send email
 * @param {string} email
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<{success: boolean, messageId: string}>}
 */
async function send(email, subject, html) {
  if (!transporter) {
    logger.error('Email transporter not initialized')
    throw new Error(getErrorMessage('EMAIL.EMAIL_SERVICE_UNAVAILABLE'))
  }
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject,
    html
  }
  try {
    const result = await transporter.sendMail(mailOptions)
    logger.info(`Email sent to ${email}: ${result.messageId}`)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error.stack}`)
    throw new Error(getErrorMessage('EMAIL.SEND_FAILED', `Failed to send email: ${error.message}`))
  }
}

/**
 * Kiểm tra kết nối SMTP
 * @returns {Promise<boolean>}
 */
async function verifyConnection() {
  if (!transporter) {
    logger.error('Email transporter not available for verification')
    return false
  }
  try {
    await transporter.verify()
    logger.info('Email SMTP connection verified')
    return true
  } catch (error) {
    logger.error(`Email SMTP connection verification failed: ${error.stack}`)
    return false
  }
}

initialize()

module.exports = {
  send,
  verifyConnection
}
