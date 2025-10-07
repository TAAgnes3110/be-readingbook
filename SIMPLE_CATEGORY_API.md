# 📚 SIMPLE CATEGORY API - DỄ SỬ DỤNG NHẤT

## Base URL
```
http://localhost:9000/api/categories
```

---

## 📋 **1. GET - Lấy danh sách thể loại**

### **Endpoint:**
```
GET /api/categories
```

### **Ví dụ:**
```
GET http://localhost:9000/api/categories
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "1",
        "name": "Tiểu thuyết",
        "image_url": "https://example.com/novel.jpg",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "2",
        "name": "Khoa học viễn tưởng",
        "image_url": "https://example.com/scifi.jpg",
        "status": "active",
        "createdAt": "2024-01-16T11:30:00.000Z",
        "updatedAt": "2024-01-16T11:30:00.000Z"
      }
    ]
  }
}
```

---

## 📖 **2. GET - Lấy thể loại theo ID**

### **Endpoint:**
```
GET /api/categories/{id}
```

### **Ví dụ:**
```
GET http://localhost:9000/api/categories/1
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "1",
      "name": "Tiểu thuyết",
      "image_url": "https://example.com/novel.jpg",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 🔢 **3. GET - Lấy ID lớn nhất**

### **Endpoint:**
```
GET /api/categories/current-max-id
```

### **Ví dụ:**
```
GET http://localhost:9000/api/categories/current-max-id
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

## ➕ **4. POST - Tạo thể loại mới**

### **Endpoint:**
```
POST /api/categories
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "name": "Tên thể loại",
  "image_url": "https://example.com/category.jpg",
  "status": "active"
}
```

**Lưu ý:**
- `name`: Tên thể loại (bắt buộc)
- `image_url`: URL ảnh thể loại (bắt buộc, phải là URL hợp lệ)
- `status`: Trạng thái (mặc định: "active")
- `createdAt` và `updatedAt` sẽ tự động được set là ngày hôm nay

### **Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": 6,
      "name": "Tên thể loại",
      "image_url": "https://example.com/category.jpg",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Tạo thể loại thành công"
}
```

---

## ✏️ **5. PUT - Cập nhật thể loại**

### **Endpoint:**
```
PUT /api/categories/{id}
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON) - Tất cả trường tùy chọn:**
```json
{
  "name": "Tên thể loại mới",
  "image_url": "https://example.com/new-category.jpg",
  "status": "inactive"
}
```

### **Ví dụ chỉ update một số trường:**
```json
{
  "name": "Tên thể loại mới"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "1",
      "name": "Tên thể loại mới",
      "image_url": "https://example.com/category.jpg",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:45:00.000Z"
    }
  },
  "message": "Cập nhật thể loại thành công"
}
```

---

## 🗑️ **6. DELETE - Xóa thể loại**

### **Endpoint:**
```
DELETE /api/categories/{id}
```

### **Ví dụ:**
```
DELETE http://localhost:9000/api/categories/1
```

### **Response:**
```json
{
  "success": true,
  "message": "Xóa thể loại thành công"
}
```

---

## 📊 **TÓM TẮT CÁC ENDPOINT:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/categories` | Lấy danh sách thể loại |
| GET | `/api/categories/current-max-id` | Lấy ID lớn nhất |
| GET | `/api/categories/{id}` | Lấy thể loại theo ID |
| POST | `/api/categories` | Tạo thể loại mới |
| PUT | `/api/categories/{id}` | Cập nhật thể loại |
| DELETE | `/api/categories/{id}` | Xóa thể loại |

---



## 🚨 **CÁC TRƯỜNG HỢP LỖI:**

### **400 Bad Request:**
```json
{
  "success": false,
  "message": "Tên thể loại là bắt buộc"
}
```

---

## 📝 **VÍ DỤ SỬ DỤNG VỚI POSTMAN:**

### **1. Tạo thể loại mới:**
```
POST http://localhost:9000/api/categories
Content-Type: application/json

{
  "name": "Truyện tranh",
  "image_url": "https://example.com/manga.jpg",
  "status": "active"
}
```

### **2. Lấy danh sách thể loại:**
```
GET http://localhost:9000/api/categories
```

### **3. Cập nhật thể loại:**
```
PUT http://localhost:9000/api/categories/1
Content-Type: application/json

{
  "name": "Truyện tranh Nhật Bản",
  "status": "active"
}
```

### **4. Xóa thể loại:**
```
DELETE http://localhost:9000/api/categories/1
```

---
