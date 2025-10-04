const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const { db } = require('../config/db')

/**
 * Tạo categories tương ứng với dữ liệu books
 */
async function createCategories() {
  try {
    console.log('📖 Reading book data to extract categories...')
    const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'book_firebase.json'), 'utf8'))

    // Lấy danh sách categories unique từ books
    const categoryMap = new Map()
    books.forEach(book => {
      if (book.category && book.categoryName) {
        categoryMap.set(book.category, {
          _id: book.category,
          name: book.categoryName,
          image_url: `https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${encodeURIComponent(book.categoryName)}`,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    })

    const categories = Array.from(categoryMap.values())
    console.log(`📊 Found ${categories.length} unique categories:`)

    categories.forEach(cat => {
      console.log(`  - ID ${cat._id}: ${cat.name}`)
    })

    // Upload categories to Firebase
    console.log('\n📤 Uploading categories to Firebase...')

    for (const category of categories) {
      try {
        await db.ref(`categories/${category._id}`).set(category)
        console.log(`✅ Created category ${category._id}: ${category.name}`)
      } catch (error) {
        console.error(`❌ Failed to create category ${category._id}: ${error.message}`)
      }
    }

    // Verify upload
    console.log('\n🔍 Verifying categories upload...')
    const snapshot = await db.ref('categories').once('value')
    const uploadedCategories = snapshot.val()
    const uploadedCount = uploadedCategories ? Object.keys(uploadedCategories).length : 0

    console.log(`📊 Total categories in Firebase: ${uploadedCount}`)

    if (uploadedCount > 0) {
      console.log('\n📋 Sample of uploaded categories:')
      const sampleCategories = Object.values(uploadedCategories).slice(0, 5)
      sampleCategories.forEach(cat => {
        console.log(`  - ${cat._id}: ${cat.name}`)
      })
    }

    // Save categories to JSON file for reference
    const outputPath = path.join(__dirname, 'categories.json')
    fs.writeFileSync(outputPath, JSON.stringify(categories, null, 2))
    console.log(`\n📁 Saved categories to: ${outputPath}`)

    return {
      totalCategories: categories.length,
      uploadedCount,
      outputPath
    }

  } catch (error) {
    console.error('❌ Error creating categories:', error.message)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await createCategories()
    console.log('\n🎉 Categories creation completed!')
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { createCategories }
