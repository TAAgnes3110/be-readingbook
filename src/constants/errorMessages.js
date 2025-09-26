const ERROR_MESSAGES = {

  GENERAL: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    INVALID_VALUE: 'Invalid value provided',
    OPERATION_FAILED: 'Operation failed',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    FORBIDDEN_ACTION: 'Forbidden action',
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error'
  },

  USER: {
    // User Creation
    REQUIRED_FIELDS: 'Email, password, confirm password, full name and phone number are required',
    USER_ID_EXISTS: 'User ID already exists',
    INVALID_USER_ID: 'User ID must be a positive integer',
    PASSWORD_MISMATCH: 'Password confirmation does not match',
    INVALID_PHONE: 'Invalid phone number format',
    EMAIL_ALREADY_EXISTS: 'Email already exists',

    // User Retrieval
    USER_NOT_FOUND: 'User not found',
    USER_NOT_ACTIVATED: 'User not found or not activated',
    ACCOUNT_NOT_ACTIVATED: 'User account is not activated',
    USER_ID_REQUIRED: 'User ID is required',
    EMAIL_REQUIRED: 'Email is required',

    // Authentication
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
    INVALID_PASSWORD: 'Invalid password',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is locked',
    ACCOUNT_SUSPENDED: 'Account is suspended',

    // Password Management
    PASSWORD_RESET_REQUIRED: 'User ID and new password are required',
    PASSWORD_TOO_WEAK: 'Password is too weak',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    PASSWORD_MISSING_UPPERCASE: 'Password must contain at least one uppercase letter',
    PASSWORD_MISSING_LOWERCASE: 'Password must contain at least one lowercase letter',
    PASSWORD_MISSING_NUMBER: 'Password must contain at least one number',
    PASSWORD_MISSING_SPECIAL: 'Password must contain at least one special character',
    OLD_PASSWORD_INCORRECT: 'Old password is incorrect',
    NEW_PASSWORD_SAME: 'New password must be different from current password',

    // User Updates
    UPDATE_FAILED: 'Failed to update user information',
    INVALID_UPDATE_DATA: 'Invalid update data provided',
    CANNOT_UPDATE_EMAIL: 'Email cannot be updated',
    CANNOT_UPDATE_ROLE: 'Role cannot be updated',

    // User Activation
    ACTIVATION_FAILED: 'Failed to activate user',
    ALREADY_ACTIVATED: 'User is already activated',
    ACTIVATION_EXPIRED: 'Activation link has expired',
    INVALID_ACTIVATION_TOKEN: 'Invalid activation token'
  },

  AUTH: {
    // Login/Logout
    LOGIN_FAILED: 'Login failed',
    LOGOUT_FAILED: 'Logout failed',
    SESSION_EXPIRED: 'Session has expired',
    SESSION_INVALID: 'Invalid session',

    // Token Management
    TOKEN_REQUIRED: 'Access token is required',
    TOKEN_INVALID: 'Invalid access token',
    TOKEN_EXPIRED: 'Access token has expired',
    REFRESH_TOKEN_INVALID: 'Invalid refresh token',
    REFRESH_TOKEN_EXPIRED: 'Refresh token has expired',
    TOKEN_GENERATION_FAILED: 'Failed to generate token',
    TOKEN_VERIFICATION_FAILED: 'Failed to verify token',

    // OTP Management
    OTP_REQUIRED: 'OTP is required',
    OTP_INVALID: 'Invalid OTP',
    OTP_EXPIRED: 'OTP has expired',
    OTP_GENERATION_FAILED: 'Failed to generate OTP',
    OTP_VERIFICATION_FAILED: 'Failed to verify OTP',
    OTP_ALREADY_SENT: 'OTP already sent, please wait before requesting again',
    OTP_LIMIT_EXCEEDED: 'OTP request limit exceeded',

    // Email Verification
    EMAIL_VERIFICATION_REQUIRED: 'Email verification is required',
    EMAIL_VERIFICATION_FAILED: 'Email verification failed',
    EMAIL_VERIFICATION_EXPIRED: 'Email verification link has expired',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',

    // Password Reset
    PASSWORD_RESET_REQUEST_FAILED: 'Failed to request password reset',
    PASSWORD_RESET_FAILED: 'Failed to reset password',
    PASSWORD_RESET_TOKEN_INVALID: 'Invalid password reset token',
    PASSWORD_RESET_TOKEN_EXPIRED: 'Password reset token has expired',
    PASSWORD_RESET_ALREADY_REQUESTED: 'Password reset already requested'
  },

  // EMAIL SERVICE ERRORS
  EMAIL: {
    SEND_FAILED: 'Failed to send email',
    INVALID_EMAIL_FORMAT: 'Invalid email format',
    EMAIL_SERVICE_UNAVAILABLE: 'Email service is currently unavailable',
    EMAIL_TEMPLATE_NOT_FOUND: 'Email template not found',
    EMAIL_ATTACHMENT_TOO_LARGE: 'Email attachment is too large',
    EMAIL_RECIPIENT_BLOCKED: 'Email recipient is blocked'
  },

  // FILE UPLOAD ERRORS
  UPLOAD: {
    FILE_REQUIRED: 'File is required',
    FILE_TOO_LARGE: 'File size is too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    UPLOAD_FAILED: 'File upload failed',
    FILE_NOT_FOUND: 'File not found',
    FILE_DELETE_FAILED: 'Failed to delete file',
    STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded'
  },

  // DATABASE ERRORS
  DATABASE: {
    CONNECTION_FAILED: 'Database connection failed',
    QUERY_FAILED: 'Database query failed',
    TRANSACTION_FAILED: 'Database transaction failed',
    CONSTRAINT_VIOLATION: 'Database constraint violation',
    DUPLICATE_ENTRY: 'Duplicate entry found',
    RECORD_NOT_FOUND: 'Record not found in database',
    INVALID_QUERY: 'Invalid database query'
  },

  // VALIDATION ERRORS
  VALIDATION: {
    // Field Validation
    REQUIRED: 'This field is required',
    MIN_LENGTH: 'Minimum length not met',
    MAX_LENGTH: 'Maximum length exceeded',
    INVALID_FORMAT: 'Invalid format',
    INVALID_RANGE: 'Value is out of valid range',
    INVALID_CHOICE: 'Invalid choice selected',

    // Specific Field Validations
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PHONE: 'Invalid phone number',
    INVALID_URL: 'Invalid URL format',
    INVALID_DATE: 'Invalid date format',
    INVALID_NUMBER: 'Invalid number format',
    INVALID_BOOLEAN: 'Invalid boolean value',

    // Custom Validations
    PASSWORD_CONFIRMATION_MISMATCH: 'Password confirmation does not match',
    TERMS_NOT_ACCEPTED: 'Terms and conditions must be accepted',
    AGE_RESTRICTION: 'Age restriction not met'
  },

  // API ERRORS
  API: {
    INVALID_REQUEST: 'Invalid request',
    MISSING_PARAMETERS: 'Missing required parameters',
    INVALID_PARAMETERS: 'Invalid parameters provided',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
    ENDPOINT_NOT_FOUND: 'API endpoint not found',
    METHOD_NOT_ALLOWED: 'HTTP method not allowed',
    REQUEST_TIMEOUT: 'Request timeout',
    PAYLOAD_TOO_LARGE: 'Request payload too large'
  },

  // EXTERNAL SERVICE ERRORS
  EXTERNAL: {
    SERVICE_UNAVAILABLE: 'External service is unavailable',
    SERVICE_TIMEOUT: 'External service timeout',
    INVALID_API_KEY: 'Invalid API key',
    QUOTA_EXCEEDED: 'Service quota exceeded',
    SERVICE_ERROR: 'External service error'
  }
}

// HELPER FUNCTIONS

/**
 * Get error message by path (e.g., 'USER.USER_NOT_FOUND')
 * @param {string} path - Dot notation path to error message
 * @param {string} [fallback] - Fallback message if path not found
 * @returns {string} - Error message
 */
const getErrorMessage = (path, fallback = 'An error occurred') => {
  const keys = path.split('.')
  let message = ERROR_MESSAGES

  for (const key of keys) {
    if (message && typeof message === 'object' && key in message) {
      message = message[key]
    } else {
      return fallback
    }
  }

  return typeof message === 'string' ? message : fallback
}

/**
 * Get user error message
 * @param {string} key - Error key
 * @param {string} [fallback] - Fallback message
 * @returns {string} - Error message
 */
const getUserError = (key, fallback) => {
  return getErrorMessage(`USER.${key}`, fallback)
}

/**
 * Get auth error message
 * @param {string} key - Error key
 * @param {string} [fallback] - Fallback message
 * @returns {string} - Error message
 */
const getAuthError = (key, fallback) => {
  return getErrorMessage(`AUTH.${key}`, fallback)
}

/**
 * Get validation error message
 * @param {string} key - Error key
 * @param {string} [fallback] - Fallback message
 * @returns {string} - Error message
 */
const getValidationError = (key, fallback) => {
  return getErrorMessage(`VALIDATION.${key}`, fallback)
}
module.exports = {
  ERROR_MESSAGES,
  getErrorMessage,
  getUserError,
  getAuthError,
  getValidationError
}
