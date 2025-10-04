const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const { db } = require('../config/db')

/**
 * Sửa lại categories với ID từ 1 đến hết và link ảnh đẹp
 */
async function fixCategories() {
  try {
    console.log('📖 Reading book data to extract categories...')
    const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'book_firebase.json'), 'utf8'))
    
    // Lấy danh sách categories unique từ books
    const categoryMap = new Map()
    books.forEach(book => {
      if (book.category && book.categoryName) {
        categoryMap.set(book.categoryName, {
          name: book.categoryName,
          oldId: book.category
        })
      }
    })
    
    // Tạo categories với ID mới từ 1 đến hết
    const categories = Array.from(categoryMap.values()).map((cat, index) => ({
      _id: index + 1,
      name: cat.name,
      image_url: getCategoryImage(cat.name),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      oldId: cat.oldId // Giữ lại để mapping
    }))
    
    console.log(`📊 Found ${categories.length} unique categories:`)
    categories.forEach(cat => {
      console.log(`  - ID ${cat._id}: ${cat.name} (old ID: ${cat.oldId})`)
    })
    
    // Clear old categories
    console.log('\n🗑️  Clearing old categories...')
    await db.ref('categories').remove()
    
    // Upload new categories to Firebase
    console.log('\n📤 Uploading new categories to Firebase...')
    
    for (const category of categories) {
      try {
        await db.ref(`categories/${category._id}`).set(category)
        console.log(`✅ Created category ${category._id}: ${category.name}`)
      } catch (error) {
        console.error(`❌ Failed to create category ${category._id}: ${error.message}`)
      }
    }
    
    // Update books with new category IDs
    console.log('\n🔄 Updating books with new category IDs...')
    const updatedBooks = books.map(book => {
      const newCategory = categories.find(cat => cat.oldId === book.category)
      if (newCategory) {
        return {
          ...book,
          category: newCategory._id,
          categoryName: newCategory.name
        }
      }
      return book
    })
    
    // Save updated books
    const updatedBooksPath = path.join(__dirname, 'book_firebase_updated.json')
    fs.writeFileSync(updatedBooksPath, JSON.stringify(updatedBooks, null, 2))
    console.log(`📁 Saved updated books to: ${updatedBooksPath}`)
    
    // Save updated test books
    const updatedTestBooks = updatedBooks.slice(0, 100)
    const updatedTestBooksPath = path.join(__dirname, 'book_test_updated.json')
    fs.writeFileSync(updatedTestBooksPath, JSON.stringify(updatedTestBooks, null, 2))
    console.log(`📁 Saved updated test books to: ${updatedTestBooksPath}`)
    
    // Verify upload
    console.log('\n🔍 Verifying categories upload...')
    const snapshot = await db.ref('categories').once('value')
    const uploadedCategories = snapshot.val()
    const uploadedCount = uploadedCategories ? Object.keys(uploadedCategories).length : 0
    
    console.log(`📊 Total categories in Firebase: ${uploadedCount}`)
    
    if (uploadedCount > 0) {
      console.log('\n📋 All uploaded categories:')
      const allCategories = Object.values(uploadedCategories)
      allCategories.forEach(cat => {
        console.log(`  - ${cat._id}: ${cat.name}`)
      })
    }
    
    // Save categories to JSON file for reference
    const outputPath = path.join(__dirname, 'categories_fixed.json')
    fs.writeFileSync(outputPath, JSON.stringify(categories, null, 2))
    console.log(`\n📁 Saved categories to: ${outputPath}`)
    
    return {
      totalCategories: categories.length,
      uploadedCount,
      outputPath,
      updatedBooksPath,
      updatedTestBooksPath
    }
    
  } catch (error) {
    console.error('❌ Error fixing categories:', error.message)
    throw error
  }
}

/**
 * Lấy link ảnh cho category
 */
function getCategoryImage(categoryName) {
  const imageMap = {
    'Fiction': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&crop=center',
    'Drama': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center',
    'History': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&crop=center',
    'Poetry': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&crop=center',
    'Romance': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&crop=center',
    'Travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop&crop=center',
    'Philosophy': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center',
    'Humor': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&crop=center',
    'Biography': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center',
    'Health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&crop=center',
    'Education': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&crop=center',
    'Religion': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center'
  }
  
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&crop=center'
}

// Main execution
async function main() {
  try {
    await fixCategories()
    console.log('\n🎉 Categories fixing completed!')
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { fixCategories }
