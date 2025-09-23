const admin = require('firebase-admin')
const httpStatus = require('http-status')
const { ApiError } = require('./index')

const db = admin.database()
const metadataRef = db.ref('metadata/lastCustomId')

/**
 * Sinh customId tự động
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
        httpStatus.INTERNAL_SERVER_ERROR,
        'Không thể sinh customId do xung đột transaction'
      )
    }

    return newCustomId.snapshot.val().toString()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Không thể sinh customId: ${error.message}`
    )
  }
}

module.exports = { generateCustomId }
