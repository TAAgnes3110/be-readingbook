const db = require('../config/db.js')

const userModel = {
  create: async (userData) => {
    const userRef = db.getRef('users')
    const newUserRef = userRef.push()
    await newUserRef.set({
      _id: newUserRef.key,
      customId: userData.customId,
      fullname: userData.fullname,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || '',
      preferences: userData.preferences || [],
      isActive: userData.isActive || true,
      role: userData.role || 'user',
      token: userData.token || null,
      comments: [],
      history: [],
      lastLogin: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    return newUserRef.key
  },

  findById: async (userId) => {
    const snapshot = await db.getRef(`users/${userId}`).once('value')
    return snapshot.val()
  },

  findByEmail: async (email) => {
    const snapshot = await db
      .getRef('users')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
    return snapshot.val()
  },

  update: async (userId, updateData) => {
    updateData.updatedAt = Date.now()
    await db.getRef(`users/${userId}`).update(updateData)
    return true
  }
}

module.exports = userModel
