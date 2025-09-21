const db = require('../config/db.js')

const genreModel = {
  create: async (genreData) => {
    const genreRef = db.getRef('genres')
    const newGenreRef = genreRef.push()
    await newGenreRef.set({
      _id: newGenreRef.key,
      name: genreData.name,
      createdAt: Date.now()
    })
    return newGenreRef.key
  },

  findById: async (genreId) => {
    const snapshot = await db.getRef(`genres/${genreId}`).once('value')
    return snapshot.val()
  }
}

module.exports = genreModel
