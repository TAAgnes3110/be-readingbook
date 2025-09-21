const { getRef } = require('../config/db')

class UserProvider {
  constructor() {
    this.ref = getRef('users')
  }

  async listenToUserChanges(userId, callback) {
    this.ref.child(userId).on('value', (snapshot) => {
      callback(snapshot.val())
    })
  }

  async listenToUserStatus(userId, callback) {
    this.ref.child(`${userId}/isActive`).on('value', (snapshot) => {
      callback(snapshot.val())
    })
  }

  async stopListening(userId) {
    this.ref.child(userId).off()
  }

  async updateUserStatus(userId, isOnline) {
    await this.ref.child(userId).update({
      isActive: isOnline,
      lastSeen: Date.now()
    })
  }
}

module.exports = new UserProvider()
