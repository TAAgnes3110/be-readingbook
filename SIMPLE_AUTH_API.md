# Simple Auth API Documentation

## Tổng quan
API này cung cấp các chức năng xác thực và quản lý tài khoản người dùng bao gồm đăng ký, đăng nhập, xác thực OTP, và quản lý mật khẩu.

## Base URL
```
http://localhost:9000/api/auth
```

## Authentication
Hầu hết các endpoint không yêu cầu authentication (trừ khi được ghi chú). Endpoint đăng nhập trả về access token để sử dụng cho các API khác.

---

## 1. Đăng ký tài khoản mới

**POST** `/api/auth/register`

**Headers:**
```
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
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "123456"
  },
  "message": "Đăng ký thành công, vui lòng kiểm tra email để xác thực OTP"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email đã được sử dụng"
}
```

---

## 2. Xác thực OTP

**POST** `/api/auth/verify-otp`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Xác thực OTP thành công, tài khoản đã được kích hoạt"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "OTP không hợp lệ hoặc đã hết hạn"
}
```

---

## 3. Gửi lại OTP

**POST** `/api/auth/resend-otp`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP đã được gửi lại đến email của bạn"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Không thể gửi OTP, vui lòng thử lại sau"
}
```

---

## 4. Đăng nhập

**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "123456",
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "phoneNumber": "0123456789",
      "avatar": "",
      "preferences": [],
      "isActive": true,
      "isOnline": true,
      "role": "user",
      "favoriteBooks": [],
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Đăng nhập thành công"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác"
}
```

---

## 5. Quên mật khẩu

**POST** `/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP đã được gửi đến email để đặt lại mật khẩu"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email không tồn tại trong hệ thống"
}
```

---

## 6. Đặt lại mật khẩu

**POST** `/api/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Xác nhận mật khẩu không khớp"
}
```

---

## Cấu trúc dữ liệu

### User Object (trong response đăng nhập)
```json
{
  "_id": "string",                    // ID người dùng
  "fullName": "string",               // Họ và tên
  "email": "string",                  // Email
  "phoneNumber": "string",            // Số điện thoại
  "avatar": "string",                 // URL ảnh đại diện
  "preferences": ["string"],          // Sở thích thể loại sách
  "isActive": "boolean",              // Trạng thái kích hoạt
  "isOnline": "boolean",              // Trạng thái online
  "role": "string",                   // Vai trò (user/admin)
  "favoriteBooks": ["string"],        // Danh sách ID sách yêu thích
  "createdAt": "number",              // Thời gian tạo
  "updatedAt": "number"               // Thời gian cập nhật cuối
}
```

### Token Response
```json
{
  "accessToken": "string",            // JWT access token (hết hạn sau 1h)
  "refreshToken": "string"            // JWT refresh token (hết hạn sau 30 ngày)
}
```

---

## Quy trình xác thực

### 1. Đăng ký tài khoản:
```
1. POST /api/auth/register
2. Kiểm tra email để nhận OTP
3. POST /api/auth/verify-otp
4. Tài khoản được kích hoạt
```

### 2. Đăng nhập:
```
1. POST /api/auth/login
2. Nhận access token và refresh token
3. Sử dụng access token cho các API khác
```

### 3. Quên mật khẩu:
```
1. POST /api/auth/forgot-password
2. Kiểm tra email để nhận OTP
3. POST /api/auth/reset-password
4. Mật khẩu được đặt lại
```

---

## Xử lý lỗi

### Mã lỗi thường gặp:

**400 Bad Request:**
- Dữ liệu đầu vào không hợp lệ
- Email đã được sử dụng (đăng ký)
- OTP không hợp lệ hoặc hết hạn
- Xác nhận mật khẩu không khớp

**401 Unauthorized:**
- Email hoặc mật khẩu không chính xác
- Tài khoản chưa được kích hoạt

**404 Not Found:**
- Email không tồn tại trong hệ thống

**429 Too Many Requests:**
- Gửi quá nhiều OTP trong thời gian ngắn

**500 Internal Server Error:**
- Lỗi server nội bộ
- Lỗi gửi email

---

## Ví dụ sử dụng

### Đăng ký tài khoản:
```bash
curl -X POST http://localhost:9000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullname": "Nguyễn Văn A",
    "username": "nguyenvana",
    "phonenumber": "0123456789"
  }'
```

### Xác thực OTP:
```bash
curl -X POST http://localhost:9000/api/auth/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

### Đăng nhập:
```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Quên mật khẩu:
```bash
curl -X POST http://localhost:9000/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com"
  }'
```

### Đặt lại mật khẩu:
```bash
curl -X POST http://localhost:9000/api/auth/reset-password \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

---

## Lưu ý quan trọng

1. **OTP Expiry**: OTP có thời hạn 5 phút (300 giây)
2. **Token Expiry**: 
   - Access token: 1 giờ
   - Refresh token: 30 ngày
3. **Rate Limiting**: Có giới hạn số lần gửi OTP để tránh spam
4. **Email Validation**: Email phải có định dạng hợp lệ
5. **Password Requirements**: Mật khẩu phải đủ mạnh (tùy theo cấu hình)
6. **Phone Validation**: Số điện thoại phải có 10-11 chữ số
7. **Auto-detection**: API tự động phát hiện loại OTP (đăng ký/reset password) dựa trên trạng thái user

---

## Security Features

1. **JWT Tokens**: Sử dụng JWT cho authentication
2. **Password Hashing**: Mật khẩu được hash bằng bcrypt
3. **OTP Security**: OTP có thời hạn và chỉ sử dụng được 1 lần
4. **Rate Limiting**: Giới hạn số request để tránh brute force
5. **Input Validation**: Tất cả input đều được validate
6. **Error Messages**: Không tiết lộ thông tin nhạy cảm trong error messages
