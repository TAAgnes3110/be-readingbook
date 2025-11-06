#!/usr/bin/env node

/**
 * Script upload dữ liệu categories và books lên Firebase Realtime Database
 * Sử dụng: node upload-data.js [options]
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config()

const { db } = require('./src/config/db')

// Đường dẫn file
const CATEGORIES_FILE = path.join(__dirname, 'uploads', 'categories.json')
const BOOKS_FILE = path.join(__dirname, 'uploads', 'book_firebase.json')

/**
 * Upload categories lên Firebase
 */
async function uploadCategories() {
  try {
    console.log('\n📂 ========================================')
    console.log('📂 UPLOAD CATEGORIES')
    console.log('📂 ========================================\n')

    // Kiểm tra file tồn tại
    if (!fs.existsSync(CATEGORIES_FILE)) {
      throw new Error(`File không tồn tại: ${CATEGORIES_FILE}`)
    }

    console.log(`📖 Đang đọc file: ${CATEGORIES_FILE}`)
    const categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'))

    console.log(`📊 Tìm thấy ${categories.length} categories\n`)

    // Hiển thị danh sách categories
    categories.forEach(cat => {
      console.log(`  - ID ${cat.id}: ${cat.name}`)
    })

    console.log(`\n📤 Đang upload ${categories.length} categories lên Firebase...\n`)

    let successCount = 0
    let failCount = 0

    for (const category of categories) {
      try {
        // Tạo dữ liệu category (match với categoryModel)
        const categoryData = {
          _id: category.id,
          name: category.name.trim(),
          image_url: category.imageUrl ? category.imageUrl.trim() : category.image_url ? category.image_url.trim() : '',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Upload lên Firebase
        await db.ref(`categories/${category.id}`).set(categoryData)
        console.log(`✅ Uploaded category ${category.id}: ${category.name}`)
        successCount++
      } catch (error) {
        console.error(`❌ Failed to upload category ${category.id}: ${error.message}`)
        failCount++
      }
    }

    console.log(`\n📊 Thống kê Categories:`)
    console.log(`   ✅ Thành công: ${successCount}`)
    console.log(`   ❌ Thất bại: ${failCount}`)

    // Verify
    console.log(`\n🔍 Đang kiểm tra dữ liệu trên Firebase...`)
    const snapshot = await db.ref('categories').once('value')
    const uploadedCategories = snapshot.val()
    const uploadedCount = uploadedCategories ? Object.keys(uploadedCategories).length : 0

    console.log(`📊 Tổng số categories trên Firebase: ${uploadedCount}`)

    return { success: true, count: successCount, failed: failCount }
  } catch (error) {
    console.error(`❌ Lỗi khi upload categories: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * Upload books lên Firebase
 * @param {number} batchSize - Số books upload mỗi batch
 */
async function uploadBooks(batchSize = 50) {
  try {
    console.log('\n📚 ========================================')
    console.log('📚 UPLOAD BOOKS')
    console.log('📚 ========================================\n')

    // Kiểm tra file tồn tại
    if (!fs.existsSync(BOOKS_FILE)) {
      throw new Error(`File không tồn tại: ${BOOKS_FILE}`)
    }

    console.log(`📖 Đang đọc file: ${BOOKS_FILE}`)
    const books = JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'))

    console.log(`📊 Tìm thấy ${books.length} books\n`)
    console.log(`🔄 Batch size: ${batchSize}\n`)

    const totalBatches = Math.ceil(books.length / batchSize)
    console.log(`📦 Sẽ upload ${totalBatches} batches...\n`)

    let totalSuccess = 0
    let totalFailed = 0

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * batchSize
      const endIndex = Math.min(startIndex + batchSize, books.length)
      const batch = books.slice(startIndex, endIndex)

      console.log(`📤 Uploading batch ${i + 1}/${totalBatches} (books ${startIndex + 1}-${endIndex})`)

      // Upload batch to Firebase
      const batchPromises = batch.map(async (book) => {
        try {
          await db.ref(`books/${book._id}`).set(book)
          return { success: true, id: book._id, title: book.title }
        } catch (error) {
          console.error(`   ❌ Failed book ${book._id}: ${error.message}`)
          return { success: false, id: book._id, title: book.title, error: error.message }
        }
      })

      const results = await Promise.all(batchPromises)

      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      totalSuccess += successCount
      totalFailed += failCount

      console.log(`   ✅ Success: ${successCount}, ❌ Failed: ${failCount}`)

      // Show failed books
      if (failCount > 0) {
        const failedBooks = results.filter(r => !r.success)
        console.log('   Failed books:')
        failedBooks.forEach(book => {
          console.log(`     - ${book.id}: ${book.title}`)
        })
      }

      // Add delay between batches to avoid rate limiting
      if (i < totalBatches - 1) {
        console.log('   ⏳ Waiting 1 second before next batch...\n')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`\n📊 Thống kê Books:`)
    console.log(`   ✅ Thành công: ${totalSuccess}`)
    console.log(`   ❌ Thất bại: ${totalFailed}`)

    // Verify
    console.log(`\n🔍 Đang kiểm tra dữ liệu trên Firebase...`)
    const snapshot = await db.ref('books').once('value')
    const uploadedBooks = snapshot.val()
    const uploadedCount = uploadedBooks ? Object.keys(uploadedBooks).length : 0

    console.log(`📊 Tổng số books trên Firebase: ${uploadedCount}`)

    if (uploadedCount > 0) {
      console.log(`\n📋 Sample books (first 5):`)
      const sampleBooks = Object.values(uploadedBooks).slice(0, 5)
      sampleBooks.forEach(book => {
        console.log(`   - ${book._id}: ${book.title} (${book.categoryName})`)
      })
    }

    return { success: true, count: totalSuccess, failed: totalFailed }
  } catch (error) {
    console.error(`❌ Lỗi khi upload books: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * Xóa tất cả categories
 */
async function clearCategories() {
  try {
    console.log('\n🗑️  Đang xóa tất cả categories...')
    await db.ref('categories').remove()
    console.log('✅ Đã xóa tất cả categories')
    return { success: true }
  } catch (error) {
    console.error(`❌ Lỗi khi xóa categories: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * Xóa tất cả books
 */
async function clearBooks() {
  try {
    console.log('\n🗑️  Đang xóa tất cả books...')
    await db.ref('books').remove()
    console.log('✅ Đã xóa tất cả books')
    return { success: true }
  } catch (error) {
    console.error(`❌ Lỗi khi xóa books: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'all'

  console.log('🚀 ========================================')
  console.log('🚀 FIREBASE DATA UPLOADER')
  console.log('🚀 ========================================\n')

  try {
    switch (command) {
      case 'categories':
      case 'cats':
        await uploadCategories()
        break

      case 'books':
        const batchSize = parseInt(args[1]) || 50
        await uploadBooks(batchSize)
        break

      case 'all':
        console.log('📦 Upload tất cả dữ liệu (categories + books)\n')
        await uploadCategories()
        await uploadBooks()
        break

      case 'clear-categories':
      case 'clear-cats':
        await clearCategories()
        break

      case 'clear-books':
        await clearBooks()
        break

      case 'clear-all':
        console.log('🗑️  Xóa tất cả dữ liệu\n')
        await clearCategories()
        await clearBooks()
        break

      default:
        console.log(`
📖 Firebase Data Uploader

Usage:
  node upload-data.js [command]

Commands:
  all                    Upload cả categories và books (mặc định)
  categories, cats       Chỉ upload categories
  books [batchSize]      Chỉ upload books (batchSize mặc định: 50)
  clear-categories       Xóa tất cả categories
  clear-books            Xóa tất cả books
  clear-all              Xóa tất cả dữ liệu

Examples:
  node upload-data.js                    # Upload tất cả
  node upload-data.js categories          # Chỉ upload categories
  node upload-data.js books               # Chỉ upload books
  node upload-data.js books 100           # Upload books với batch size 100
  node upload-data.js clear-all           # Xóa tất cả

Files:
  - uploads/categories.json
  - uploads/book_firebase.json
        `)
        process.exit(0)
    }

    console.log('\n✅ Hoàn thành!\n')
    process.exit(0)
  } catch (error) {
    console.error(`\n❌ Lỗi: ${error.message}\n`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  uploadCategories,
  uploadBooks,
  clearCategories,
  clearBooks
}

