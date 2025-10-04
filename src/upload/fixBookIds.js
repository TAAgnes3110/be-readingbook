const fs = require('fs')
const path = require('path')

/**
 * Sửa lại ID của books từ 1 đến hết
 */
function fixBookIds() {
  try {
    console.log('📖 Reading book_firebase.json...')
    const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'book_firebase.json'), 'utf8'))
    
    console.log(`📊 Total books: ${books.length}`)
    console.log(`🔢 Original ID range: ${books[0]._id} - ${books[books.length - 1]._id}`)
    
    // Sắp xếp lại ID từ 1 đến hết
    const fixedBooks = books.map((book, index) => ({
      ...book,
      _id: index + 1
    }))
    
    console.log(`✅ New ID range: 1 - ${fixedBooks.length}`)
    
    // Lưu file mới
    const outputPath = path.join(__dirname, 'book_firebase_fixed.json')
    fs.writeFileSync(outputPath, JSON.stringify(fixedBooks, null, 2))
    
    console.log(`📁 Saved to: ${outputPath}`)
    
    // Tạo file test với 100 books đầu tiên
    const testBooks = fixedBooks.slice(0, 100)
    const testOutputPath = path.join(__dirname, 'book_test_fixed.json')
    fs.writeFileSync(testOutputPath, JSON.stringify(testBooks, null, 2))
    
    console.log(`🧪 Created test file: ${testOutputPath}`)
    
    // Thống kê
    console.log('\n📊 Sample of fixed books:')
    fixedBooks.slice(0, 5).forEach(book => {
      console.log(`  ID ${book._id}: ${book.title} by ${book.author}`)
    })
    
    return {
      totalBooks: fixedBooks.length,
      outputPath,
      testOutputPath
    }
    
  } catch (error) {
    console.error('❌ Error fixing book IDs:', error.message)
    throw error
  }
}

// Chạy script
if (require.main === module) {
  fixBookIds()
}

module.exports = { fixBookIds }
