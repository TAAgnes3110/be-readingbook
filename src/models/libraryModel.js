const db = require('../config/db.js')

const libraryModel = {
  create: async (libraryData) => {
    const libraryRef = db.getRef('library')
    const newLibraryRef = libraryRef.push()
    await newLibraryRef.set({
      _id: newLibraryRef.key,
      userId: libraryData.userId,
      bookId: libraryData.bookId,
      status: libraryData.status || 'wishlist',
      progress: libraryData.progress || 0,
      rating: libraryData.rating,
      review: libraryData.review,
      lastReadAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    return newLibraryRef.key
  },

  findByUserAndBook: async (userId, bookId) => {
    const snapshot = await db
      .getRef('library')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value')
    const libraries = snapshot.val()
    return Object.values(libraries || {}).find((lib) => lib.bookId === bookId)
  }
}

module.exports = libraryModel
