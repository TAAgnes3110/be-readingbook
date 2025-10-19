# 📚 SIMPLE BOOK API - DỄ SỬ DỤNG NHẤT

## Base URL
```
http://localhost:9000/api/books
```

---

## 📋 **1. GET - Lấy danh sách sách**

### **Endpoint:**
```
GET /api/books
```

### **Query Parameters (tùy chọn):**
- `page`: Số trang (mặc định: 1)
- `limit`: Số sách/trang (mặc định: 10)
- `search`: Từ khóa tìm kiếm
- `category`: ID thể loại
- `status`: active/inactive (mặc định: active)
- `sortBy`: title/author/createdAt/updatedAt (mặc định: createdAt)
- `sortOrder`: asc/desc (mặc định: desc)

### **Ví dụ:**
```
GET http://localhost:9000/api/books?page=1&limit=5&search=harry&category=1&status=active&sortBy=title&sortOrder=asc
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "1",
        "title": "Harry Potter",
        "author": "J.K. Rowling",
        "category": 1,
        "description": "A magical story...",
        "release_date": "2024-01-15",
        "cover_url": "https://example.com/cover.jpg",
        "txt_url": "https://example.com/book.txt",
        "book_url": "https://example.com/book.pdf",
        "epub_url": "https://example.com/book.epub",
        "keywords": ["magic", "wizard"],
        "status": "active",
        "avgRating": 4.5,
        "numberOfReviews": 100,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 50,
      "totalPages": 10
    }
  }
}
```

---

## 📖 **2. GET - Lấy sách theo ID**

### **Endpoint:**
```
GET /api/books/{id}
```

### **Ví dụ:**
```
GET http://localhost:9000/api/books/1
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "book": {
      "_id": "1",
      "title": "Harry Potter",
      "author": "J.K. Rowling",
      "category": 1,
      "description": "A magical story...",
      "release_date": "2024-01-15",
      "cover_url": "https://example.com/cover.jpg",
      "txt_url": "https://example.com/book.txt",
      "book_url": "https://example.com/book.pdf",
      "epub_url": "https://example.com/book.epub",
      "keywords": ["magic", "wizard"],
      "status": "active",
      "avgRating": 4.5,
      "numberOfReviews": 100,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 🆕 **3. GET - Lấy sách mới nhất**

### **Endpoint:**
```
GET /api/books/latest
```

### **Query Parameters:**
- `limit`: Số sách (mặc định: 10)

### **Ví dụ:**
```
GET http://localhost:9000/api/books/latest?limit=5
```

**Lưu ý:**
- Sách được sắp xếp theo `createdAt` (ngày tạo) từ mới nhất đến cũ nhất
- Sách mới tạo sẽ xuất hiện đầu tiên trong danh sách

### **Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "5",
        "title": "Latest Book",
        "author": "New Author",
        "category": 2,
        "description": "A new book...",
        "release_date": "2024-01-20",
        "cover_url": "https://example.com/latest-cover.jpg",
        "txt_url": "https://example.com/latest-book.txt",
        "book_url": "https://example.com/latest-book.pdf",
        "epub_url": "https://example.com/latest-book.epub",
        "keywords": ["new", "latest"],
        "status": "active",
        "avgRating": 4.8,
        "numberOfReviews": 25,
        "createdAt": "2024-01-20T15:30:00.000Z",
        "updatedAt": "2024-01-20T15:30:00.000Z"
      }
    ]
  }
}
```

---

## 🔢 **4. GET - Lấy ID lớn nhất**

### **Endpoint:**
```
GET /api/books/current-max-id
```

### **Ví dụ:**
```
GET http://localhost:9000/api/books/current-max-id
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "currentMaxId": 5
  }
}
```

---

## ➕ **5. POST - Tạo sách mới**

### **Endpoint:**
```
POST /api/books
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "title": "Tên sách",
  "author": "Tác giả",
  "category": 1,
  "description": "Mô tả sách (ít nhất 10 ký tự)",
  "release_date": "2024-01-15",
  "cover_url": "https://example.com/cover.jpg",
  "txt_url": "https://example.com/book.txt",
  "book_url": "https://example.com/book.pdf",
  "epub_url": "https://example.com/book.epub",
  "keywords": ["từ khóa 1", "từ khóa 2"],
  "status": "active",
  "avgRating": 4.5,
  "numberOfReviews": 100
}
```

**Lưu ý:**
- Nếu không cung cấp `release_date`, hệ thống sẽ tự động sử dụng ngày hôm nay
- `createdAt` và `updatedAt` sẽ tự động được set là ngày hôm nay

### **Response:**
```json
{
  "success": true,
  "data": {
    "book": {
      "_id": 6,
      "title": "Tên sách",
      "author": "Tác giả",
      "category": 1,
      "description": "Mô tả sách (ít nhất 10 ký tự)",
      "release_date": "2024-01-15",
      "cover_url": "https://example.com/cover.jpg",
      "txt_url": "https://example.com/book.txt",
      "book_url": "https://example.com/book.pdf",
      "epub_url": "https://example.com/book.epub",
      "keywords": ["từ khóa 1", "từ khóa 2"],
      "status": "active",
      "avgRating": 4.5,
      "numberOfReviews": 100,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Tạo sách thành công"
}
```

---

## ✏️ **6. PUT - Cập nhật sách**

### **Endpoint:**
```
PUT /api/books/{id}
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON) - Tất cả trường tùy chọn:**
```json
{
  "title": "Tên sách mới",
  "author": "Tác giả mới",
  "category": 2,
  "description": "Mô tả mới",
  "release_date": "2024-02-15",
  "cover_url": "https://example.com/new-cover.jpg",
  "txt_url": "https://example.com/new-book.txt",
  "book_url": "https://example.com/new-book.pdf",
  "epub_url": "https://example.com/new-book.epub",
  "keywords": ["từ khóa mới"],
  "status": "inactive",
  "avgRating": 4.8,
  "numberOfReviews": 150
}
```

### **Ví dụ chỉ update một số trường:**
```json
{
  "title": "Tên sách mới",
  "status": "inactive"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "book": {
      "_id": "1",
      "title": "Tên sách mới",
      "author": "Tác giả",
      "category": 1,
      "description": "Mô tả sách",
      "release_date": "2024-01-15",
      "cover_url": "https://example.com/cover.jpg",
      "txt_url": "https://example.com/book.txt",
      "book_url": "https://example.com/book.pdf",
      "epub_url": "https://example.com/book.epub",
      "keywords": ["từ khóa 1", "từ khóa 2"],
      "status": "inactive",
      "avgRating": 4.5,
      "numberOfReviews": 100,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:45:00.000Z"
    }
  },
  "message": "Cập nhật sách thành công"
}
```

---

## 🗑️ **7. DELETE - Xóa sách**

### **Endpoint:**
```
DELETE /api/books/{id}
```

### **Ví dụ:**
```
DELETE http://localhost:9000/api/books/1
```

### **Response:**
```json
{
  "success": true,
  "message": "Xóa sách thành công"
}
```

---

## 📊 **TÓM TẮT CÁC ENDPOINT:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/books` | Lấy danh sách sách (có filter) |
| GET | `/api/books/latest` | Lấy sách mới nhất |
| GET | `/api/books/current-max-id` | Lấy ID lớn nhất |
| GET | `/api/books/{id}` | Lấy sách theo ID |
| POST | `/api/books` | Tạo sách mới |
| PUT | `/api/books/{id}` | Cập nhật sách |
| DELETE | `/api/books/{id}` | Xóa sách |
