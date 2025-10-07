const httpStatus = require('http-status')
const { ApiError } = require('./index')
const { db } = require('../config/db')

const userMetadataRef = db.ref('metadata/lastCustomId')
const categoryMetadataRef = db.ref('metadata/lastCategoryId')

/**
 * Generate custom ID automatically for users
 * @returns {Promise<string>}
 * @throws {ApiError}
 */
const generateCustomId = async () => {
  try {
    const newCustomId = await userMetadataRef.transaction((currentValue) => {
      return (currentValue || 0) + 1
    })

    if (!newCustomId.committed) {
      throw new ApiError(
        500,
        'Unable to generate customId due to transaction conflict'
      )
    }

    return newCustomId.snapshot.val().toString()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      500,
      `Failed to generate customId: ${error.message}`
    )
  }
}

/**
 * Generate custom ID automatically for categories
 * @returns {Promise<string>}
 * @throws {ApiError}
 */
const generateCategoryId = async () => {
  try {
    const newCategoryId = await categoryMetadataRef.transaction((currentValue) => {
      return (currentValue || 0) + 1
    })

    if (!newCategoryId.committed) {
      throw new ApiError(
        500,
        'Unable to generate categoryId due to transaction conflict'
      )
    }

    return newCategoryId.snapshot.val().toString()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      500,
      `Failed to generate categoryId: ${error.message}`
    )
  }
}

module.exports = { generateCustomId, generateCategoryId }
