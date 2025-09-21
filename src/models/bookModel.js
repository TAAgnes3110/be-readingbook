const db = require('../config/db.js')

const bookModel = {
  create: async (bookData) => {
    const bookRef = db.getRef('books')
    const newBookRef = bookRef.push()
    await newBookRef.set({
      _id: newBookRef.key,
      title: bookData.title,
      description: bookData.description || '',
      coverUrl: bookData.coverUrl || '',
      authorId: bookData.authorId,
      releasedDate: bookData.releasedDate,
      avgRating: 0,
      txtUrl: bookData.txtUrl || '',
      epubUrl: bookData.epubUrl || '',
      bookUrl: bookData.bookUrl || '',
      reviews: [],
      createdAt: Date.now(),
      updatedAt: null
    })
    return newBookRef.key
  },

  findById: async (bookId) => {
    const snapshot = await db.getRef(`books/${bookId}`).once('value')
    return snapshot.val()
  },

  update: async (bookId, updateData) => {
    updateData.updatedAt = Date.now()
    await db.getRef(`books/${bookId}`).update(updateData)
    return true
  }
}

module.exports = bookModel
