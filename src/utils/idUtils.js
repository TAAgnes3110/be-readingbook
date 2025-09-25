const httpStatus = require('http-status')
const { ApiError } = require('./index')
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
        'Unable to generate customId due to transaction conflict'
      )
    }

    return newCustomId.snapshot.val().toString()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to generate customId: ${error.message}`
    )
  }
}

module.exports = { generateCustomId }
