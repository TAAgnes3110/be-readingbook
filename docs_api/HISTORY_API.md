# History API Documentation

API quản lý lịch sử đọc sách và bookmark của người dùng.

## 📋 Tổng quan
- **Base URL:** `/api/history`
- **Authentication:** Tất cả endpoints đều yêu cầu Bearer token
- **Response Format:** JSON với cấu trúc `{ success, message, data }`

## 🔄 Luồng hoạt động
1. **User đọc sách** → Client theo dõi trang hiện tại
2. **User thoát giao diện đọc** → Client gửi dữ liệu bookmark lên server
3. **Server lưu bookmark** → Cập nhật hoặc tạo mới lịch sử đọc
4. **User xem lịch sử** → Lấy danh sách sách đã đọc

## 🔐 Authentication

### Cách lấy token:
```bash
# 1. Login để lấy token
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response sẽ có accessToken
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "userId": 123, "email": "user@example.com" }
  }
}
```

### Sử dụng token:
```bash
# Thêm vào header mọi request
Authorization: Bearer <access_token>
```

### ⚠️ Lỗi thường gặp:
- `401 Authorization header is required` → Thiếu header
- `401 Authorization header must start with Bearer ` → Format sai
- `401 Token is required` → Thiếu token
- `401 Invalid token` → Token hết hạn hoặc không hợp lệ

## 📚 API Endpoints

### 1. 💾 Lưu Bookmark
**POST** `/api/history/bookmark`

Lưu hoặc cập nhật bookmark khi user thoát giao diện đọc sách.

#### 📥 Request Body
```json
{
  "userId": 123,        // ID người dùng (bắt buộc)
  "bookId": 456,        // ID sách (bắt buộc)
  "chapterId": "ch1"    // ID chương (bắt buộc)
}
```

#### 📝 Ví dụ request:
```bash
curl -X POST http://localhost:3000/api/history/bookmark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 123,
    "bookId": 456,
    "chapterId": "ch1"
  }'
```

#### 📤 Response - Tạo mới
```json
{
  "success": true,
  "message": "Bookmark đã được lưu thành công",
  "data": {
    "_id": 789,
    "userId": 123,
    "bookId": 456,
    "chapterId": "ch1",
    "lastReadAt": 1703123456789,
    "createdAt": 1703120000000,
    "updatedAt": 1703123456789
  }
}
```

#### 📤 Response - Cập nhật
```json
{
  "success": true,
  "message": "Bookmark đã được cập nhật thành công",
  "data": {
    "_id": 789,
    "userId": 123,
    "bookId": 456,
    "chapterId": "ch1",
    "lastReadAt": 1703123456789,
    "createdAt": 1703120000000,
    "updatedAt": 1703123456789
  }
}
```

### 2. 📖 Lấy Lịch Sử Đọc Sách
**GET** `/api/history/{userId}`

Lấy danh sách sách đã đọc của user với phân trang và sắp xếp.

#### 📥 Parameters
- **URL:** `userId` (number) - ID người dùng
- **Query:**
  - `page` (number, optional) - Trang hiện tại (mặc định: 1)
  - `limit` (number, optional) - Số items/trang (mặc định: 10, tối đa: 100)
  - `sortBy` (string, optional) - Sắp xếp theo: `lastReadAt`, `createdAt` (mặc định: `lastReadAt`)
  - `sortOrder` (string, optional) - Thứ tự: `asc`, `desc` (mặc định: `desc`)

#### 📝 Ví dụ request:
```bash
# Lấy 10 sách gần đọc nhất
GET /api/history/123?page=1&limit=10&sortBy=lastReadAt&sortOrder=desc

# Lấy sách theo thời gian tạo
GET /api/history/123?sortBy=createdAt&sortOrder=desc

# Lấy trang 2, mỗi trang 5 items
GET /api/history/123?page=2&limit=5
```

#### Response
```json
{
  "success": true,
  "message": "Lấy lịch sử đọc sách thành công",
  "data": {
    "histories": [
      {
        "_id": "789",
        "userId": 123,
        "bookId": 456,
        "chapterId": "ch1",
        "lastReadAt": 1703123456789,
        "createdAt": 1703120000000,
        "updatedAt": 1703123456789,
        "book": {
          "_id": 456,
          "title": "Tên Sách",
          "author": "Tác Giả",
          "cover_url": "https://example.com/cover.jpg",
          "category": 1
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 3. 🔖 Lấy Bookmark Của Một Cuốn Sách
**GET** `/api/history/{userId}/bookmark/{bookId}`

Lấy thông tin bookmark của một cuốn sách cụ thể.

#### 📥 Parameters
- **URL:** `userId` (number) - ID người dùng
- **URL:** `bookId` (number) - ID sách

#### 📝 Ví dụ request:
```bash
GET /api/history/123/bookmark/456
```

#### Response - Có bookmark
```json
{
  "success": true,
  "message": "Lấy bookmark thành công",
  "data": {
    "_id": "789",
    "userId": 123,
    "bookId": 456,
    "chapterId": "ch1",
    "lastReadAt": 1703123456789,
    "createdAt": 1703120000000,
    "updatedAt": 1703123456789,
    "book": {
      "_id": 456,
      "title": "Tên Sách",
      "author": "Tác Giả",
      "cover_url": "https://example.com/cover.jpg"
    }
  }
}
```

#### Response - Chưa có bookmark
```json
{
  "success": true,
  "message": "Chưa có bookmark cho cuốn sách này",
  "data": {
    "bookId": 456,
    "chapterId": null,
    "lastReadAt": null,
    "book": {
      "_id": 456,
      "title": "Tên Sách",
      "author": "Tác Giả",
      "cover_url": "https://example.com/cover.jpg"
    }
  }
}
```

### 4. 🗑️ Xóa Bookmark
**DELETE** `/api/history/{userId}/bookmark/{bookId}`

Xóa bookmark của một cuốn sách cụ thể.

#### 📥 Parameters
- **URL:** `userId` (number) - ID người dùng
- **URL:** `bookId` (number) - ID sách

#### 📝 Ví dụ request:
```bash
DELETE /api/history/123/bookmark/456
```

#### Response
```json
{
  "success": true,
  "message": "Xóa bookmark thành công"
}
```

### 5. 👤 Lấy Lịch Sử Theo User
**GET** `/api/history/user/{userId}`

Lấy tất cả lịch sử đọc sách của một user.

#### 📥 Parameters
- **URL:** `userId` (number) - ID người dùng

#### 📝 Ví dụ request:
```bash
GET /api/history/user/123
```

#### Response
```json
{
  "success": true,
  "message": "Lấy lịch sử đọc của user 123 thành công",
  "data": [
    {
      "_id": "789",
      "userId": 123,
      "bookId": 456,
      "chapterId": "ch1",
      "chapterId": "ch1",
      "lastReadAt": 1703123456789,
      "createdAt": 1703120000000,
      "updatedAt": 1703123456789
    }
  ],
  "count": 1
}
```

### 6. 📚 Lấy Lịch Sử Theo Book
**GET** `/api/history/book/{bookId}`

Lấy tất cả lịch sử đọc của một cuốn sách.

#### 📥 Parameters
- **URL:** `bookId` (number) - ID sách

#### 📝 Ví dụ request:
```bash
GET /api/history/book/456
```

#### Response
```json
{
  "success": true,
  "message": "Lấy lịch sử đọc của book 456 thành công",
  "data": [
    {
      "_id": "789",
      "userId": 123,
      "bookId": 456,
      "chapterId": "ch1",
      "chapterId": "ch1",
      "lastReadAt": 1703123456789,
      "createdAt": 1703120000000,
      "updatedAt": 1703123456789
    }
  ],
  "count": 1
}
```


## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "ID người dùng và ID sách là bắt buộc"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authorization header is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng hoặc sách"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Lưu bookmark thất bại: [chi tiết lỗi]"
}
```

## 📋 Response Format
Tất cả API đều trả về JSON với cấu trúc:
```json
{
  "success": boolean,    // true/false
  "message": string,     // Thông báo mô tả
  "data": object         // Dữ liệu trả về (nếu có)
}
```

## 🔄 Luồng Hoạt Động Chi Tiết

### 1. 📖 User Đọc Sách
- User chọn sách từ danh sách
- Client theo dõi trang hiện tại và chapter (nếu là EPUB)

### 2. 💾 Lưu Bookmark
- User thoát giao diện đọc sách
- Client gửi chapterId hiện tại
- Gọi API `POST /api/history/bookmark`

### 3. 🗄️ Xử Lý Database
- Server kiểm tra user và book tồn tại
- Tìm lịch sử đọc hiện có cho user + book
- **Nếu chưa có:** Tạo mới với `historyId` riêng biệt
- **Nếu đã có:** Cập nhật thông tin và `lastReadAt`
- Lưu vào Firebase với cấu trúc:
  ```json
  {
    "_id": 789,           // History ID riêng biệt
    "userId": 123,        // User ID (khớp với user._id)
    "bookId": 456,        // Book ID
    "chapterId": "ch1",   // Chapter ID (bắt buộc)
    "lastReadAt": 1703123456789,
    "createdAt": 1703120000000,
    "updatedAt": 1703123456789
  }
  ```

## ⚙️ Tính Năng

### 🔢 ID Management
- **User ID:** Sử dụng `metadata/lastCustomId`
- **History ID:** Sử dụng `metadata/lastHistoryId` (riêng biệt)
- **Book ID:** Sử dụng `metadata/lastBookId`

### 📊 Phân Trang & Sắp Xếp
- Phân trang: `page` và `limit` (tối đa 100 items/trang)
- Sắp xếp theo: `lastReadAt`, `createdAt`
- Thứ tự: `asc` (tăng dần) hoặc `desc` (giảm dần)

### ✅ Validation
- Joi validation cho tất cả input
- Kiểm tra user và book tồn tại
- Thông báo lỗi chi tiết bằng tiếng Việt

### 🛡️ Error Handling
- `ApiError` với status code phù hợp
- Thông báo lỗi rõ ràng và dễ hiểu
- Xử lý graceful khi không tìm thấy dữ liệu

## 📝 Ghi Chú
- API này chỉ quản lý bookmark và lịch sử đọc, không có tính năng theo dõi tiến độ đọc
- Hỗ trợ EPUB với chapterId (bắt buộc)
- Tất cả thời gian được lưu dưới dạng timestamp (milliseconds)
- Mỗi user chỉ có một bookmark duy nhất cho mỗi cuốn sách
- API tự động cập nhật `lastReadAt` khi lưu bookmark
