/**
 * Test cases cho categoryModel
 * Test tất cả các trường hợp: CREATE, UPDATE, DELETE, FIND
 */

const httpStatus = require('http-status')

// Mock Firebase Database
const mockCategories = {}
const mockDb = {
  ref: jest.fn((path) => {
    const pathParts = path.split('/')
    const id = pathParts[1]

    return {
      once: jest.fn((event) => {
        return Promise.resolve({
          val: () => {
            if (path === 'categories') {
              return Object.keys(mockCategories).length > 0 ? mockCategories : null
            }
            return mockCategories[id] || null
          }
        })
      }),
      set: jest.fn((data) => {
        if (id) {
          mockCategories[id] = data
        }
        return Promise.resolve()
      }),
      update: jest.fn((data) => {
        if (mockCategories[id]) {
          mockCategories[id] = { ...mockCategories[id], ...data }
        }
        return Promise.resolve()
      }),
      remove: jest.fn(() => {
        delete mockCategories[id]
        return Promise.resolve()
      }),
      transaction: jest.fn((callback) => {
        return Promise.resolve({
          committed: true,
          snapshot: {
            val: () => 1
          }
        })
      })
    }
  })
}

// Mock db module - phải mock trước khi import bất kỳ module nào
const mockGetRef = jest.fn((path) => mockDb.ref(path))

jest.mock('../src/config/db', () => ({
  admin: {},
  db: mockDb,
  auth: {},
  getRef: (path) => mockGetRef(path),
  createUser: jest.fn(),
  getUser: jest.fn(),
  deleteUser: jest.fn(),
  getUserByEmail: jest.fn()
}))

// Import sau khi mock
const { ApiError } = require('../src/utils/index')
const categoryModel = require('../src/models/categoryModel')

describe('CategoryModel Tests', () => {
  beforeEach(() => {
    // Reset mock data trước mỗi test
    Object.keys(mockCategories).forEach(key => delete mockCategories[key])
    jest.clearAllMocks()

    // Setup mock để getNextCategoryId và các hàm khác hoạt động đúng
    mockGetRef.mockImplementation((path) => {
      if (path === 'categories') {
        return {
          once: jest.fn(() => Promise.resolve({
            val: () => {
              const keys = Object.keys(mockCategories)
              return keys.length > 0 ? mockCategories : null
            }
          }))
        }
      }
      return mockDb.ref(path)
    })
  })

  describe('CREATE Category', () => {
    test('✅ CREATE - Tạo category thành công', async () => {
      const categoryData = {
        name: 'Tiểu thuyết',
        image_url: 'https://example.com/image.jpg'
      }

      const result = await categoryModel.create(categoryData)

      expect(result).toHaveProperty('categoryId')
      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Thể loại đã được tạo thành công')
      expect(result.categoryId).toBe(1) // ID đầu tiên
    })

    test('❌ CREATE - Thiếu tên thể loại', async () => {
      const categoryData = {
        image_url: 'https://example.com/image.jpg'
      }

      await expect(categoryModel.create(categoryData)).rejects.toThrow(ApiError)
    })

    test('❌ CREATE - Thiếu image_url', async () => {
      const categoryData = {
        name: 'Tiểu thuyết'
      }

      await expect(categoryModel.create(categoryData)).rejects.toThrow(ApiError)
    })

    test('❌ CREATE - Tên category đã tồn tại', async () => {
      // Tạo category đầu tiên
      const categoryData1 = {
        name: 'Tiểu thuyết',
        image_url: 'https://example.com/image1.jpg'
      }
      await categoryModel.create(categoryData1)

      // Thử tạo category với tên trùng
      const categoryData2 = {
        name: 'Tiểu thuyết',
        image_url: 'https://example.com/image2.jpg'
      }

      await expect(categoryModel.create(categoryData2)).rejects.toThrow(ApiError)
      await expect(categoryModel.create(categoryData2)).rejects.toThrow('Thể loại với tên này đã tồn tại')
    })

    test('❌ CREATE - Tên category trùng (case-insensitive)', async () => {
      // Tạo category với tên "Tiểu thuyết"
      const categoryData1 = {
        name: 'Tiểu thuyết',
        image_url: 'https://example.com/image1.jpg'
      }
      await categoryModel.create(categoryData1)

      // Thử tạo với tên "tiểu thuyết" (chữ thường)
      const categoryData2 = {
        name: 'tiểu thuyết',
        image_url: 'https://example.com/image2.jpg'
      }

      await expect(categoryModel.create(categoryData2)).rejects.toThrow(ApiError)
      await expect(categoryModel.create(categoryData2)).rejects.toThrow('Thể loại với tên này đã tồn tại')
    })
  })

  describe('UPDATE Category', () => {
    test('✅ UPDATE - Cập nhật category thành công', async () => {
      // Tạo category trước
      const categoryData = {
        name: 'Tiểu thuyết',
        image_url: 'https://example.com/image.jpg'
      }
      const created = await categoryModel.create(categoryData)

      // Cập nhật category
      const updateData = {
        name: 'Tiểu thuyết Mới',
        image_url: 'https://example.com/new-image.jpg'
      }

      const result = await categoryModel.update(created.categoryId, updateData)
      expect(result).toBe(true)
    })

    test('❌ UPDATE - Category ID không tồn tại', async () => {
      const updateData = {
        name: 'Tên mới'
      }

      await expect(categoryModel.update(999, updateData)).rejects.toThrow(ApiError)
    })

    test('❌ UPDATE - Thiếu categoryId', async () => {
      const updateData = {
        name: 'Tên mới'
      }

      await expect(categoryModel.update(null, updateData)).rejects.toThrow(ApiError)
    })

    test('❌ UPDATE - Tên mới trùng với category khác', async () => {
      // Tạo 2 categories
      const category1 = await categoryModel.create({
        name: 'Category 1',
        image_url: 'https://example.com/img1.jpg'
      })

      await categoryModel.create({
        name: 'Category 2',
        image_url: 'https://example.com/img2.jpg'
      })

      // Thử cập nhật category1 với tên trùng category2
      const updateData = {
        name: 'Category 2'
      }

      await expect(categoryModel.update(category1.categoryId, updateData)).rejects.toThrow(ApiError)
      await expect(categoryModel.update(category1.categoryId, updateData)).rejects.toThrow('Thể loại với tên này đã tồn tại')
    })

    test('✅ UPDATE - Có thể giữ nguyên tên của chính nó', async () => {
      // Tạo category
      const created = await categoryModel.create({
        name: 'Category Test',
        image_url: 'https://example.com/img.jpg'
      })

      // Cập nhật với cùng tên (cho phép)
      const updateData = {
        name: 'Category Test',
        status: 'inactive'
      }

      const result = await categoryModel.update(created.categoryId, updateData)
      expect(result).toBe(true)
    })
  })

  describe('DELETE Category', () => {
    test('✅ DELETE - Xóa category thành công', async () => {
      // Tạo category trước
      const created = await categoryModel.create({
        name: 'Category To Delete',
        image_url: 'https://example.com/img.jpg'
      })

      // Xóa category
      const result = await categoryModel.delete(created.categoryId)
      expect(result).toBe(true)

      // Kiểm tra category đã bị xóa
      await expect(categoryModel.findById(created.categoryId)).rejects.toThrow('Không tìm thấy thể loại')
    })

    test('❌ DELETE - Category ID không tồn tại', async () => {
      await expect(categoryModel.delete(999)).rejects.toThrow(ApiError)
    })

    test('❌ DELETE - Thiếu categoryId', async () => {
      await expect(categoryModel.delete(null)).rejects.toThrow(ApiError)
    })
  })

  describe('FIND BY ID', () => {
    test('✅ FIND BY ID - Tìm thấy category', async () => {
      // Tạo category
      const created = await categoryModel.create({
        name: 'Category Test',
        image_url: 'https://example.com/img.jpg'
      })

      // Tìm category
      const found = await categoryModel.findById(created.categoryId)

      expect(found).toHaveProperty('_id')
      expect(found).toHaveProperty('name', 'Category Test')
    })

    test('❌ FIND BY ID - Category không tồn tại', async () => {
      await expect(categoryModel.findById(999)).rejects.toThrow(ApiError)
    })

    test('❌ FIND BY ID - Thiếu categoryId', async () => {
      await expect(categoryModel.findById(null)).rejects.toThrow(ApiError)
    })
  })

  describe('FIND BY NAME', () => {
    test('✅ FIND BY NAME - Tìm thấy category', async () => {
      // Tạo category
      await categoryModel.create({
        name: 'Category Test',
        image_url: 'https://example.com/img.jpg'
      })

      // Tìm category
      const found = await categoryModel.findByName('Category Test')

      expect(found).not.toBeNull()
      expect(found).toHaveProperty('name', 'Category Test')
    })

    test('✅ FIND BY NAME - Case-insensitive search', async () => {
      // Tạo category với tên "Category Test"
      await categoryModel.create({
        name: 'Category Test',
        image_url: 'https://example.com/img.jpg'
      })

      // Tìm với tên khác case
      const found1 = await categoryModel.findByName('category test')
      expect(found1).not.toBeNull()

      const found2 = await categoryModel.findByName('CATEGORY TEST')
      expect(found2).not.toBeNull()
    })

    test('✅ FIND BY NAME - Không tìm thấy category', async () => {
      const found = await categoryModel.findByName('Non-existent Category')
      expect(found).toBeNull()
    })

    test('❌ FIND BY NAME - Thiếu tên', async () => {
      await expect(categoryModel.findByName(null)).rejects.toThrow(ApiError)
    })
  })

  describe('FIND ALL', () => {
    test('✅ FIND ALL - Lấy tất cả categories', async () => {
      // Tạo một số categories
      await categoryModel.create({
        name: 'Category 1',
        image_url: 'https://example.com/img1.jpg'
      })
      await categoryModel.create({
        name: 'Category 2',
        image_url: 'https://example.com/img2.jpg'
      })

      const all = await categoryModel.findAll()
      expect(all).toBeDefined()
      expect(typeof all).toBe('object')
    })

    test('✅ FIND ALL - Trả về object rỗng khi chưa có category', async () => {
      const all = await categoryModel.findAll()
      expect(all).toEqual({})
    })
  })
})
