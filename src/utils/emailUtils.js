/**
 * Utility functions for email encoding/decoding for Firebase paths
 */

/**
 * Encode email address to be Firebase Realtime Database path-safe
 * Replaces invalid characters with safe alternatives
 * @param {string} email - Email address to encode
 * @returns {string} - Encoded email safe for Firebase paths
 */
function encodeEmailForFirebase(email) {
  if (!email) return ''

  return email
    .toLowerCase()
    .replace(/\./g, '_DOT_')
    .replace(/@/g, '_AT_')
    .replace(/\+/g, '_PLUS_')
    .replace(/-/g, '_DASH_')
    .replace(/:/g, '_COLON_')
    .replace(/#/g, '_HASH_')
    .replace(/\$/g, '_DOLLAR_')
    .replace(/\[/g, '_LBRACKET_')
    .replace(/\]/g, '_RBRACKET_')
}

/**
 * Decode email address from Firebase path format back to original
 * @param {string} encodedEmail - Encoded email from Firebase path
 * @returns {string} - Original email address
 */
function decodeEmailFromFirebase(encodedEmail) {
  if (!encodedEmail) return ''

  return encodedEmail
    .replace(/_DOT_/g, '.')
    .replace(/_AT_/g, '@')
    .replace(/_PLUS_/g, '+')
    .replace(/_DASH_/g, '-')
    .replace(/_COLON_/g, ':')
    .replace(/_HASH_/g, '#')
    .replace(/_DOLLAR_/g, '$')
    .replace(/_LBRACKET_/g, '[')
    .replace(/_RBRACKET_/g, ']')
}

/**
 * Create a Firebase-safe key for email-based operations
 * @param {string} email - Email address
 * @param {string} prefix - Optional prefix (default: 'email')
 * @returns {string} - Firebase-safe key
 */
function createEmailKey(email, prefix = 'email') {
  const encodedEmail = encodeEmailForFirebase(email)
  return `${prefix}:${encodedEmail}`
}

/**
 * Extract email from Firebase key
 * @param {string} key - Firebase key with encoded email
 * @param {string} prefix - Optional prefix (default: 'email')
 * @returns {string} - Original email address
 */
function extractEmailFromKey(key, prefix = 'email') {
  if (!key || !key.startsWith(`${prefix}:`)) return ''

  const encodedEmail = key.substring(prefix.length + 1)
  return decodeEmailFromFirebase(encodedEmail)
}

module.exports = {
  encodeEmailForFirebase,
  decodeEmailFromFirebase,
  createEmailKey,
  extractEmailFromKey
}
