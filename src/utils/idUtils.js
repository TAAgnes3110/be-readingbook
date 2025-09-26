const httpStatus = require('http-status')
const { ApiError } = require('./index')
const { getErrorMessage } = require('../constants/errorMessages')
const { db } = require('../config/db')

const metadataRef = db.ref('metadata/lastCustomId')

/**
 * Generate custom ID automatically
 * @returns {Promise<string>}
 * @throws {ApiError}
 */
const generateCustomId = async () => {
  try {
    const newCustomId = await metadataRef.transaction((currentValue) => {
      return (currentValue || 0) + 1
    })

    if (!newCustomId.committed) {
      throw new ApiError(
        httpStatus.status.INTERNAL_SERVER_ERROR,
        getErrorMessage('DATABASE.TRANSACTION_FAILED')
      )
    }

    return newCustomId.snapshot.val().toString()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      getErrorMessage('DATABASE.QUERY_FAILED', `Failed to generate customId: ${error.message}`)
    )
  }
}

module.exports = { generateCustomId }
