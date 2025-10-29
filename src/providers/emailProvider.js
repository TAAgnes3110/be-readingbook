const nodemailer = require('nodemailer')
const config = require('../config/config')
const logger = require('../config/logger')

let transporter = null
let emailProvider = 'smtp'

/**
 * Initialize SMTP email transporter
 */
function initializeSMTP() {
  if (!config.email.smtp.host || !config.email.smtp.auth.user) {
    logger.warn('SMTP configuration missing')
    return false
  }

  try {
    const port = parseInt(config.email.smtp.port) || 587
    transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: port,
      secure: port === 465,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: config.env === 'production'
      }
    })
    logger.info(`✅ SMTP email transporter initialized (${config.email.smtp.host}:${port})`)
    return true
  } catch (error) {
    logger.error(`❌ Failed to initialize SMTP: ${error.message}`)
    return false
  }
}

/**
 * Initialize Resend API (Alternative for platforms blocking SMTP)
 */
async function sendViaResend(email, subject, html) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    throw new Error('Resend API key not configured')
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.email.from || 'onboarding@resend.dev',
        to: email,
        subject: subject,
        html: html
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Resend API error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    logger.info(`✅ Email sent via Resend to ${email}: ${data.id}`)
    return { success: true, messageId: data.id }
  } catch (error) {
    logger.error(`❌ Failed to send email via Resend: ${error.message}`)
    throw error
  }
}

/**
 * Initialize email provider based on environment
 */
function initialize() {
  if (process.env.RESEND_API_KEY) {
    emailProvider = 'resend'
    logger.info('📧 Using Resend API for email delivery')
    return
  }

  // Fallback to SMTP
  const smtpInitialized = initializeSMTP()
  if (smtpInitialized) {
    emailProvider = 'smtp'
  } else {
    logger.warn('⚠️  No email provider configured! Emails will not be sent.')
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
  // Sử dụng Resend nếu có API key
  if (emailProvider === 'resend' || process.env.RESEND_API_KEY) {
    return await sendViaResend(email, subject, html)
  }

  if (!transporter) {
    logger.error('❌ Email transporter not initialized')
    throw new Error('Email service not configured. Please set SMTP credentials or RESEND_API_KEY.')
  }

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject,
    html
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    logger.info(`✅ Email sent via SMTP to ${email}: ${result.messageId}`)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    logger.error(`❌ Failed to send email via SMTP to ${email}: ${error.stack}`)

    if (process.env.RESEND_API_KEY) {
      logger.info('🔄 Retrying with Resend API...')
      return await sendViaResend(email, subject, html)
    }

    throw error
  }
}

/**
 * Kiểm tra kết nối email service
 * @returns {Promise<boolean>}
 */
async function verifyConnection() {
  if (emailProvider === 'resend' || process.env.RESEND_API_KEY) {
    logger.info('📧 Using Resend API (no connection verification needed)')
    return true
  }

  if (!transporter) {
    logger.error('❌ Email transporter not available for verification')
    return false
  }

  try {
    await transporter.verify()
    logger.info('✅ SMTP connection verified successfully')
    return true
  } catch (error) {
    logger.error(`❌ SMTP connection verification failed: ${error.message}`)
    return false
  }
}

initialize()

module.exports = {
  send,
  verifyConnection
}
