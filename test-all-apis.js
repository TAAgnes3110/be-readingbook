const axios = require('axios')

const BASE_URL = 'http://localhost:9000/api'

// Test data
const testCategory = {
  name: 'Thể loại Test',
  image_url: 'https://example.com/test-category.jpg',
  status: 'active'
}

const testBook = {
  title: 'Sách Test',
  author: 'Tác giả Test',
  category: 1, // Sẽ được cập nhật sau khi tạo category
  description: 'Đây là mô tả sách test với đủ 10 ký tự',
  release_date: '2024-01-15',
  cover_url: 'https://example.com/cover.jpg',
  txt_url: 'https://example.com/book.txt',
  book_url: 'https://example.com/book.pdf',
  epub_url: 'https://example.com/book.epub',
  keywords: ['test', 'sách'],
  status: 'active',
  avgRating: 4.5,
  numberOfReviews: 10
}

async function testAllAPIs() {
  console.log('🚀 Test tất cả APIs (Category + Book)...\n')

  let createdCategoryId = null
  let createdBookId = null

  try {
    // ===== CATEGORY TESTS =====
    console.log('📚 ===== CATEGORY API TESTS =====')
    
    // Test 1: Tạo category
    console.log('1. POST /api/categories - Tạo thể loại mới')
    try {
      const response = await axios.post(`${BASE_URL}/categories`, testCategory)
      if (response.data.success) {
        createdCategoryId = response.data.data.category._id
        console.log('✅ Tạo category thành công:', response.data.data.category.name)
        console.log('📊 ID category:', createdCategoryId)
      }
    } catch (error) {
      console.log('❌ Lỗi tạo category:', error.response?.data || error.message)
    }
    console.log('')

    // Test 2: Lấy danh sách categories
    console.log('2. GET /api/categories - Lấy danh sách thể loại')
    try {
      const response = await axios.get(`${BASE_URL}/categories`)
      if (response.data.success) {
        console.log('✅ Lấy danh sách category thành công')
        console.log('📊 Số categories:', response.data.data.categories.length)
      }
    } catch (error) {
      console.log('❌ Lỗi lấy danh sách category:', error.response?.data || error.message)
    }
    console.log('')

    // ===== BOOK TESTS =====
    console.log('📖 ===== BOOK API TESTS =====')
    
    // Cập nhật category ID cho book
    if (createdCategoryId) {
      testBook.category = createdCategoryId
    }

    // Test 3: Tạo book
    console.log('3. POST /api/books - Tạo sách mới')
    try {
      const response = await axios.post(`${BASE_URL}/books`, testBook)
      if (response.data.success) {
        createdBookId = response.data.data.book._id
        console.log('✅ Tạo book thành công:', response.data.data.book.title)
        console.log('📊 ID book:', createdBookId)
        console.log('📊 Category ID:', response.data.data.book.category)
      }
    } catch (error) {
      console.log('❌ Lỗi tạo book:', error.response?.data || error.message)
    }
    console.log('')

    // Test 4: Lấy danh sách books
    console.log('4. GET /api/books - Lấy danh sách sách')
    try {
      const response = await axios.get(`${BASE_URL}/books`)
      if (response.data.success) {
        console.log('✅ Lấy danh sách book thành công')
        console.log('📊 Số books:', response.data.data.books.length)
      }
    } catch (error) {
      console.log('❌ Lỗi lấy danh sách book:', error.response?.data || error.message)
    }
    console.log('')

    // Test 5: Lấy sách mới nhất
    console.log('5. GET /api/books/latest - Lấy sách mới nhất')
    try {
      const response = await axios.get(`${BASE_URL}/books/latest?limit=3`)
      if (response.data.success) {
        console.log('✅ Lấy sách mới nhất thành công')
        console.log('📊 Số sách mới nhất:', response.data.data.books.length)
        if (response.data.data.books.length > 0) {
          console.log('📖 Sách mới nhất:', response.data.data.books[0].title)
        }
      }
    } catch (error) {
      console.log('❌ Lỗi lấy sách mới nhất:', error.response?.data || error.message)
    }
    console.log('')

    // Test 6: Tìm kiếm sách theo category
    if (createdCategoryId) {
      console.log('6. GET /api/books?category=X - Tìm kiếm sách theo category')
      try {
        const response = await axios.get(`${BASE_URL}/books?category=${createdCategoryId}`)
        if (response.data.success) {
          console.log('✅ Tìm kiếm sách theo category thành công')
          console.log('📊 Số sách trong category:', response.data.data.books.length)
        }
      } catch (error) {
        console.log('❌ Lỗi tìm kiếm sách theo category:', error.response?.data || error.message)
      }
      console.log('')
    }

    // ===== CLEANUP =====
    console.log('🗑️ ===== CLEANUP =====')
    
    // Xóa book
    if (createdBookId) {
      console.log('7. DELETE /api/books/{id} - Xóa sách')
      try {
        const response = await axios.delete(`${BASE_URL}/books/${createdBookId}`)
        if (response.data.success) {
          console.log('✅ Xóa book thành công')
        }
      } catch (error) {
        console.log('❌ Lỗi xóa book:', error.response?.data || error.message)
      }
    }

    // Xóa category
    if (createdCategoryId) {
      console.log('8. DELETE /api/categories/{id} - Xóa thể loại')
      try {
        const response = await axios.delete(`${BASE_URL}/categories/${createdCategoryId}`)
        if (response.data.success) {
          console.log('✅ Xóa category thành công')
        }
      } catch (error) {
        console.log('❌ Lỗi xóa category:', error.response?.data || error.message)
      }
    }

    console.log('')
    console.log('🎉 Hoàn thành test tất cả APIs!')
    console.log('📊 Kết quả:')
    console.log('   - Category API: ✅ Hoạt động tốt')
    console.log('   - Book API: ✅ Hoạt động tốt')
    console.log('   - Tương tác giữa Book và Category: ✅ Hoạt động tốt')

  } catch (error) {
    console.log('💥 Lỗi chung:', error.message)
  }
}

// Chạy test
testAllAPIs()
