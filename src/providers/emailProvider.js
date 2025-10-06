const nodemailer = require('nodemailer')
const { Resend } = require('resend')
const config = require('../config/config')
const logger = require('../config/logger')

let transporter = null
let resend = null

/**
 * Initialize email provider based on configuration
 */
function initialize() {
  if (config.email.provider === 'resend' && config.email.resend.apiKey) {
    resend = new Resend(config.email.resend.apiKey)
    logger.info('Resend email provider initialized')
  } else if (config.email.smtp.host && config.email.smtp.auth.user) {
    transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass
      }
    })
    logger.info('SMTP email transporter initialized')
  } else {
    logger.warn('Email configuration missing')
  }
}

/**
 * Send email using configured provider
 * @param {string} email
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<{success: boolean, messageId: string}>}
 */
async function send(email, subject, html) {
  try {
    if (config.email.provider === 'resend' && resend) {
      // Send using Resend
      const result = await resend.emails.send({
        from: config.email.from,
        to: email,
        subject,
        html
      })
      logger.info(`Email sent via Resend to ${email}: ${result.data?.id}`)
      return { success: true, messageId: result.data?.id }
    } else if (transporter) {
      // Send using SMTP
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject,
        html
      }
      const result = await transporter.sendMail(mailOptions)
      logger.info(`Email sent via SMTP to ${email}: ${result.messageId}`)
      return { success: true, messageId: result.messageId }
    } else {
      logger.error('No email provider configured')
      throw new Error('Email service not configured')
    }
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error.stack}`)
    throw error
  }
}

/**
 * Verify email provider connection
 * @returns {Promise<boolean>}
 */
async function verifyConnection() {
  try {
    if (config.email.provider === 'resend' && resend) {
      // Test Resend connection by getting domains
      await resend.domains.list()
      logger.info('Resend email provider connection verified')
      return true
    } else if (transporter) {
      // Test SMTP connection
      await transporter.verify()
      logger.info('SMTP email connection verified')
      return true
    } else {
      logger.error('No email provider available for verification')
      return false
    }
  } catch (error) {
    logger.error(`Email provider connection verification failed: ${error.stack}`)
    return false
  }
}

initialize()

module.exports = {
  send,
  verifyConnection
}
