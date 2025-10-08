# Simple User API Documentation

## Tổng quan
API này cung cấp các chức năng quản lý người dùng và sách yêu thích. Tất cả các endpoint đều yêu cầu xác thực (Bearer token) trừ khi được ghi chú khác.

## Base URL
```
http://localhost:9000/api/users
```

## Authentication
Tất cả các endpoint đều yêu cầu header:
```
Authorization: Bearer <access_token>
```

---

## 1. Tạo người dùng mới

**POST** `/api/users`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullname": "Nguyễn Văn A",
  "username": "nguyenvana",
  "phonenumber": "0123456789",
  "role": "user",
  "preferences": ["fiction", "science"],
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "123456"
  },
  "message": "Người dùng đã được tạo thành công, vui lòng xác thực OTP"
}
```

---

## 2. Lấy thông tin người dùng theo email

**GET** `/api/users?email=user@example.com`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "123456",
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phoneNumber": "0123456789",
    "avatar": "https://example.com/avatar.jpg",
    "preferences": ["fiction", "science"],
    "isActive": true,
    "isOnline": false,
    "role": "user",
    "favoriteBooks": ["book1", "book2"],
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  },
  "message": "User retrieved by email successfully"
}
```

---

## 3. Lấy thông tin người dùng theo ID

**GET** `/api/users/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "123456",
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phoneNumber": "0123456789",
    "avatar": "https://example.com/avatar.jpg",
    "preferences": ["fiction", "science"],
    "isActive": true,
    "isOnline": false,
    "role": "user",
    "favoriteBooks": ["book1", "book2"],
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  },
  "message": "User retrieved successfully"
}
```

---

## 4. Lấy danh sách sách yêu thích

**GET** `/api/users/:userId/favorites`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "favoriteBooks": [
      {
        "_id": "book1",
        "title": "Tên sách 1",
        "author": "Tác giả 1",
        "description": "Mô tả sách...",
        "category": "Fiction",
        "coverImage": "https://example.com/cover1.jpg",
        "status": "active",
        "createdAt": 1234567890,
        "updatedAt": 1234567890
      },
      {
        "_id": "book2",
        "title": "Tên sách 2",
        "author": "Tác giả 2",
        "description": "Mô tả sách...",
        "category": "Science",
        "coverImage": "https://example.com/cover2.jpg",
        "status": "active",
        "createdAt": 1234567890,
        "updatedAt": 1234567890
      }
    ],
    "favoriteBookIds": ["book1", "book2"]
  },
  "message": "Favorite books retrieved successfully"
}
```

---

## 5. Thêm sách vào danh sách yêu thích

**POST** `/api/users/:userId/favorites/:bookId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Book added to favorites successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Sách đã có trong danh sách yêu thích"
}
```

---

## 6. Xóa sách khỏi danh sách yêu thích

**DELETE** `/api/users/:userId/favorites/:bookId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Book removed from favorites successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Sách không có trong danh sách yêu thích"
}
```

---

## Cấu trúc dữ liệu User

### User Object
```json
{
  "_id": "string",                    // ID người dùng
  "fullName": "string",               // Họ và tên
  "email": "string",                  // Email (unique)
  "phoneNumber": "string",            // Số điện thoại
  "avatar": "string",                 // URL ảnh đại diện
  "preferences": ["string"],          // Sở thích thể loại sách
  "isActive": "boolean",              // Trạng thái kích hoạt
  "isOnline": "boolean",              // Trạng thái online
  "role": "string",                   // Vai trò (user/admin)
  "favoriteBooks": ["string"],        // Danh sách ID sách yêu thích
  "comments": ["string"],             // Danh sách bình luận
  "history": ["string"],              // Lịch sử đọc sách
  "lastLogin": "number",              // Thời gian đăng nhập cuối
  "createdAt": "number",              // Thời gian tạo
  "updatedAt": "number"               // Thời gian cập nhật cuối
}
```

---

## Xử lý lỗi

### Mã lỗi thường gặp:

**400 Bad Request:**
- Dữ liệu đầu vào không hợp lệ
- Sách đã có trong danh sách yêu thích (khi thêm)
- Sách không có trong danh sách yêu thích (khi xóa)

**401 Unauthorized:**
- Token không hợp lệ hoặc hết hạn
- Thiếu header Authorization

**404 Not Found:**
- Không tìm thấy người dùng
- Không tìm thấy sách

**500 Internal Server Error:**
- Lỗi server nội bộ

---

## Ví dụ sử dụng

### Thêm sách yêu thích:
```bash
curl -X POST \
  http://localhost:9000/api/users/123456/favorites/book789 \
  -H 'Authorization: Bearer your_access_token_here' \
  -H 'Content-Type: application/json'
```

### Lấy danh sách sách yêu thích:
```bash
curl -X GET \
  http://localhost:9000/api/users/123456/favorites \
  -H 'Authorization: Bearer your_access_token_here'
```

### Xóa sách yêu thích:
```bash
curl -X DELETE \
  http://localhost:9000/api/users/123456/favorites/book789 \
  -H 'Authorization: Bearer your_access_token_here'
```

### Lấy thông tin người dùng:
```bash
curl -X GET \
  http://localhost:9000/api/users/123456 \
  -H 'Authorization: Bearer your_access_token_here'
```

---

## Lưu ý quan trọng

1. **Authentication**: Tất cả endpoints đều yêu cầu Bearer token hợp lệ
2. **User ID**: Có thể sử dụng Firebase UID hoặc custom ID
3. **Favorite Books**: API trả về cả thông tin chi tiết sách và danh sách ID
4. **Error Handling**: Tất cả lỗi đều được trả về dưới dạng JSON với message rõ ràng
5. **Validation**: Tất cả input đều được validate trước khi xử lý
