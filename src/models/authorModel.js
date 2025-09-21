const db = require('../config/db.js')

const authorModel = {
  create: async (authorData) => {
    const authorRef = db.getRef('authors')
    const newAuthorRef = authorRef.push()
    await newAuthorRef.set({
      _id: newAuthorRef.key,
      name: authorData.name
    })
    return newAuthorRef.key
  },

  findById: async (authorId) => {
    const snapshot = await db.getRef(`authors/${authorId}`).once('value')
    return snapshot.val()
  }
}

module.exports = authorModel
