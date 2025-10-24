# FEEDBACK API Documentation

## Tổng quan
API Feedback cho phép người dùng gửi phản hồi về ứng dụng và quản lý các phản hồi của mình.

## Endpoints

### 1. Tạo feedback mới
**POST** `/api/feedback`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789",
  "email": "user@example.com",
  "comment": "Ứng dụng rất tốt, tôi rất thích!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Gửi phản hồi thành công",
  "data": {
    "feedbackId": 123,
    "message": "Phản hồi đã được tạo thành công"
  }
}
```

### 2. Lấy danh sách feedback của user hiện tại
**GET** `/api/feedback/my-feedbacks`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số lượng mỗi trang (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Lấy phản hồi của bạn thành công",
  "data": [
    {
      "_id": "123",
      "userId": 1,
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0123456789",
      "email": "user@example.com",
      "comment": "Ứng dụng rất tốt!",
      "status": "pending",
      "createdAt": 1640995200000,
      "updatedAt": 1640995200000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Lấy feedback theo ID
**GET** `/api/feedback/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy phản hồi thành công",
  "data": {
    "_id": "123",
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0123456789",
    "email": "user@example.com",
    "comment": "Ứng dụng rất tốt!",
    "status": "pending",
    "createdAt": 1640995200000,
    "updatedAt": 1640995200000
  }
}
```

### 4. Cập nhật feedback
**PUT** `/api/feedback/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "comment": "Cập nhật bình luận"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật phản hồi thành công",
  "data": {
    "_id": "123",
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0123456789",
    "email": "user@example.com",
    "comment": "Cập nhật bình luận",
    "status": "pending",
    "createdAt": 1640995200000,
    "updatedAt": 1640995201000
  }
}
```

### 5. Xóa feedback
**DELETE** `/api/feedback/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Xóa phản hồi thành công"
}
```

## Validation Rules

### Tạo feedback
- `fullName`: Bắt buộc, 2-100 ký tự
- `phoneNumber`: Tùy chọn, 10-11 chữ số
- `email`: Tùy chọn, định dạng email hợp lệ
- `comment`: Bắt buộc, 10-1000 ký tự

### Cập nhật feedback
- `comment`: Tùy chọn, 10-1000 ký tự

## Status Codes
- `200`: Thành công
- `201`: Tạo thành công
- `400`: Dữ liệu không hợp lệ
- `401`: Không có quyền truy cập
- `404`: Không tìm thấy
- `500`: Lỗi server

## Error Response Format
```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "errors": ["Chi tiết lỗi cụ thể"]
}
```

## Notes
- Tất cả endpoints đều yêu cầu authentication
- User chỉ có thể xem và quản lý feedback của chính mình
- Timestamps được trả về dưới dạng Unix timestamp (milliseconds)
- Pagination được áp dụng cho danh sách feedback
