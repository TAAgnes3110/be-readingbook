const { getRef } = require('../config/db')
const logger = require('../config/logger')

const ref = getRef('users')

/**
 * Lắng nghe thay đổi toàn bộ user object
 * @param {string} userId
 * @param {Function} callback
 */
function listenToUserChanges(userId, callback) {
  try {
    ref.child(userId).on('value', (snapshot) => {
      callback(snapshot.val())
    })
  } catch (error) {
    logger.error(`Lỗi khi lắng nghe thay đổi user ${userId}: ${error.stack}`)
    throw error
  }
}

/**
 * Lắng nghe trạng thái online/offline
 * @param {string} userId
 * @param {Function} callback
 */
function listenToUserStatus(userId, callback) {
  try {
    ref.child(`${userId}/isOnline`).on('value', (snapshot) => {
      callback(snapshot.val())
    })
  } catch (error) {
    logger.error(`Lỗi khi lắng nghe trạng thái user ${userId}: ${error.stack}`)
    throw error
  }
}

/**
 * Dừng lắng nghe thay đổi user
 * @param {string} userId
 */
function stopListening(userId) {
  try {
    ref.child(userId).off()
  } catch (error) {
    logger.error(`Lỗi khi dừng listener cho user ${userId}: ${error.stack}`)
    throw error
  }
}

/**
 * Cập nhật trạng thái user
 * @param {string} userId
 * @param {boolean} isOnline
 */
async function updateUserStatus(userId, isOnline) {
  try {
    await ref.child(userId).update({
      isOnline,
      lastSeen: Date.now(),
      updatedAt: Date.now()
    })
  } catch (error) {
    logger.error(`Lỗi khi cập nhật trạng thái user ${userId}: ${error.stack}`)
    throw error
  }
}

module.exports = {
  listenToUserChanges,
  listenToUserStatus,
  stopListening,
  updateUserStatus
}
