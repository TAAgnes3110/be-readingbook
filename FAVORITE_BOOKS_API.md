# Favorite Books API Documentation

## Tổng quan
API này cho phép người dùng quản lý danh sách sách yêu thích của họ. Người dùng có thể thêm, xóa và xem danh sách sách yêu thích.

## Endpoints

### 1. Lấy danh sách sách yêu thích
**GET** `/api/users/:userId/favorites`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `userId` (string, required): ID của người dùng

**Response:**
```json
{
  "success": true,
  "data": {
    "favoriteBooks": [
      {
        "_id": "book_id_1",
        "title": "Tên sách 1",
        "author": "Tác giả 1",
        "description": "Mô tả sách...",
        "category": "Thể loại",
        "coverImage": "url_cover_image",
        "status": "active",
        "createdAt": 1234567890,
        "updatedAt": 1234567890
      }
    ],
    "favoriteBookIds": ["book_id_1", "book_id_2"]
  },
  "message": "Favorite books retrieved successfully"
}
```

### 2. Thêm sách vào danh sách yêu thích
**POST** `/api/users/:userId/favorites/:bookId`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `userId` (string, required): ID của người dùng
- `bookId` (string, required): ID của sách

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

### 3. Xóa sách khỏi danh sách yêu thích
**DELETE** `/api/users/:userId/favorites/:bookId`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `userId` (string, required): ID của người dùng
- `bookId` (string, required): ID của sách

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

## Cấu trúc dữ liệu

### User Model
Khi tạo user mới, trường `favoriteBooks` sẽ được khởi tạo là một mảng rỗng:
```json
{
  "_id": "user_id",
  "fullName": "Tên người dùng",
  "email": "email@example.com",
  "favoriteBooks": [],
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### Favorite Books
- `favoriteBooks`: Mảng chứa các ID của sách yêu thích
- Khi thêm sách yêu thích, ID sách sẽ được thêm vào mảng này
- Khi xóa sách yêu thích, ID sách sẽ được loại bỏ khỏi mảng này

## Xử lý lỗi

### Lỗi thường gặp:
1. **400 Bad Request**: 
   - Thiếu userId hoặc bookId
   - Sách đã có trong danh sách yêu thích (khi thêm)
   - Sách không có trong danh sách yêu thích (khi xóa)

2. **404 Not Found**: 
   - Không tìm thấy người dùng
   - Sách không tồn tại

3. **401 Unauthorized**: 
   - Token không hợp lệ hoặc hết hạn

## Ví dụ sử dụng

### Thêm sách yêu thích:
```bash
curl -X POST \
  http://localhost:3000/api/users/123/favorites/456 \
  -H 'Authorization: Bearer your_token_here'
```

### Xóa sách yêu thích:
```bash
curl -X DELETE \
  http://localhost:3000/api/users/123/favorites/456 \
  -H 'Authorization: Bearer your_token_here'
```

### Lấy danh sách sách yêu thích:
```bash
curl -X GET \
  http://localhost:3000/api/users/123/favorites \
  -H 'Authorization: Bearer your_token_here'
```

## Lưu ý
- Tất cả các endpoint đều yêu cầu xác thực (Bearer token)
- Khi lấy danh sách sách yêu thích, API sẽ trả về cả thông tin chi tiết của sách và danh sách ID
- Nếu một sách trong danh sách yêu thích không còn tồn tại, nó sẽ được bỏ qua và không hiển thị trong kết quả
