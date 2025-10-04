const fs = require('fs')
const path = require('path')

// Đọc file book.json gốc
const bookData = JSON.parse(fs.readFileSync(path.join(__dirname, 'book.json'), 'utf8'))

// Hàm chuyển đổi dữ liệu
function convertBookData(books) {
  return books.map(book => {
    // Chuyển đổi keywords từ string sang array
    const keywords = book.keywords 
      ? book.keywords.split(';').map(k => k.trim()).filter(k => k.length > 0)
      : []

    // Chuyển đổi release_date từ string sang Date
    let releaseDate = new Date().toISOString()
    if (book.release_date) {
      try {
        // Thử parse date từ format "Jul 1, 2001"
        const date = new Date(book.release_date)
        if (!isNaN(date.getTime())) {
          releaseDate = date.toISOString()
        }
      } catch (error) {
        console.warn(`Invalid date for book ${book.id}: ${book.release_date}`)
      }
    }

    // Tạo category mặc định (có thể cần mapping genres)
    let category = 1 // Default category ID
    if (book.genres) {
      // Mapping genres to category IDs (cần cập nhật theo categories thực tế)
      const genreMapping = {
        'Fiction': 1,
        'Drama': 2,
        'Adventure': 3,
        'Romance': 4,
        'Mystery': 5,
        'Science Fiction': 6,
        'Fantasy': 7,
        'Horror': 8,
        'Biography': 9,
        'History': 10,
        'Poetry': 11,
        'Philosophy': 12,
        'Religion': 13,
        'Science': 14,
        'Travel': 15,
        'Humor': 16,
        'Children': 17,
        'Education': 18,
        'Business': 19,
        'Health': 20
      }
      
      // Tìm category phù hợp
      for (const [genre, catId] of Object.entries(genreMapping)) {
        if (book.genres.toLowerCase().includes(genre.toLowerCase())) {
          category = catId
          break
        }
      }
    }

    return {
      _id: book.id,
      title: book.title || 'Untitled',
      author: book.author || 'Unknown Author',
      category: category,
      categoryName: getCategoryName(category),
      description: book.description || 'No description available',
      release_date: releaseDate,
      cover_url: book.cover_url || '',
      txt_url: book.txt_url || '',
      book_url: book.book_url || '',
      epub_url: book.epub_url || '',
      keywords: keywords,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Giữ lại các trường bổ sung nếu cần
      avgRating: book.avgRating || 0,
      numberOfReviews: book.numberOfReviews || 0
    }
  })
}

// Hàm lấy tên category
function getCategoryName(categoryId) {
  const categoryNames = {
    1: 'Fiction',
    2: 'Drama', 
    3: 'Adventure',
    4: 'Romance',
    5: 'Mystery',
    6: 'Science Fiction',
    7: 'Fantasy',
    8: 'Horror',
    9: 'Biography',
    10: 'History',
    11: 'Poetry',
    12: 'Philosophy',
    13: 'Religion',
    14: 'Science',
    15: 'Travel',
    16: 'Humor',
    17: 'Children',
    18: 'Education',
    19: 'Business',
    20: 'Health'
  }
  return categoryNames[categoryId] || 'Other'
}

// Chuyển đổi dữ liệu
console.log('Converting book data...')
const convertedData = convertBookData(bookData)

// Lưu file mới
const outputPath = path.join(__dirname, 'book_firebase.json')
fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2))

console.log(`✅ Converted ${convertedData.length} books`)
console.log(`📁 Saved to: ${outputPath}`)

// Tạo file nhỏ hơn để test (100 books đầu tiên)
const testData = convertedData.slice(0, 100)
const testOutputPath = path.join(__dirname, 'book_test.json')
fs.writeFileSync(testOutputPath, JSON.stringify(testData, null, 2))

console.log(`🧪 Created test file with ${testData.length} books: ${testOutputPath}`)

// Thống kê
const categoryStats = {}
convertedData.forEach(book => {
  categoryStats[book.categoryName] = (categoryStats[book.categoryName] || 0) + 1
})

console.log('\n📊 Category distribution:')
Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`  ${category}: ${count} books`)
  })
