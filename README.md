# 📚 Reading Book API

> API Backend cho ứng dụng đọc sách với Firebase Authentication và Socket.io

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Documentation](#api-documentation)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Troubleshooting](#troubleshooting)
- [Đóng góp](#đóng-góp)

## 🔧 Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Firebase Project**: Cần có project Firebase để sử dụng Authentication
- **Gmail Account**: Để gửi email (hoặc SMTP server khác)

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd Backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

```bash
# Copy file cấu hình mẫu
cp env.example .env

# Chỉnh sửa file .env với thông tin thực tế
```

## ⚙️ Cấu hình

### Firebase Setup

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **Project Settings** > **General**
4. Lấy các thông tin sau:

   - **Project ID**
   - **Project Number**
   - **Database URL**
   - **Web API Key**

5. Tải file `serviceAccountKey.json`:
   - Vào **Project Settings** > **Service accounts**
   - Click **Generate new private key**
   - Đặt file vào thư mục gốc của project

### Email Setup (Gmail)

1. Bật **2-Factor Authentication** cho Gmail
2. Tạo **App Password**:
   - Vào Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Tạo password cho "Mail"
3. Sử dụng App Password trong `SMTP_PASSWORD`

### Cấu hình .env

```env
# Thông tin cơ bản
NODE_ENV=development
APP_NAME=Reading Book API
APP_HOST=localhost
APP_PORT=3000

# Firebase (BẮT BUỘC)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key

# Email (BẮT BUỘC)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# JWT (BẮT BUỘC)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=1h

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🏃‍♂️ Chạy ứng dụng

### Development Mode

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Production Mode

```bash
# Build project
npm run build

# Chạy production
npm run production
```

### Các lệnh khác

```bash
# Lint code
npm run lint

# Fix linting errors
npm run lint:fix

# Build only
npm run build
```

## 📖 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Health Check

```http
GET /health
```

### Authentication Endpoints

#### Đăng ký

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Xác thực OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### User Endpoints

#### Lấy thông tin user

```http
GET /api/users/profile
Authorization: Bearer <jwt-token>
```

#### Cập nhật profile

```http
PUT /api/users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "New Name",
  "phone": "0123456789"
}
```

## 📁 Cấu trúc dự án

```
src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── config/               # Configuration files
│   ├── config.js         # Main config
│   ├── db.js            # Database config
│   ├── logger.js        # Winston logger
│   ├── morgan.js        # HTTP request logger
│   └── passport.js      # Passport strategies
├── controllers/          # Route controllers
│   ├── authController.js
│   └── userController.js
├── middlewares/          # Custom middlewares
│   ├── authMiddleware.js
│   └── validate.js
├── models/              # Data models
│   └── userModel.js
├── providers/           # External service providers
│   ├── emailProvider.js
│   ├── otpProvider.js
│   └── userProvider.js
├── routes/              # API routes
│   ├── authRoute.js
│   └── userRoute.js
├── services/            # Business logic
│   ├── authService.js
│   ├── emailService.js
│   ├── firebaseService.js
│   ├── otpService.js
│   ├── tokenService.js
│   └── userService.js
├── sockets/             # Socket.io handlers
│   ├── index.js
│   ├── initialzationSocket.js
│   └── userSocket.js
├── utils/               # Utility functions
│   ├── ApiError.js
│   ├── catchAsync.js
│   ├── emailUtils.js
│   ├── idUtils.js
│   ├── passwordUtils.js
│   └── pick.js
└── validations/         # Input validation
    ├── authValidation.js
    ├── custom.js
    └── userValidation.js
```

## 🔧 Troubleshooting

### Lỗi thường gặp

#### 1. Firebase Authentication Error

```
Error: Firebase project not found
```

**Giải pháp**: Kiểm tra `FIREBASE_PROJECT_ID` trong file `.env`

#### 2. Email không gửi được

```
Error: Invalid login
```

**Giải pháp**:

- Kiểm tra `SMTP_USERNAME` và `SMTP_PASSWORD`
- Đảm bảo đã bật 2FA và sử dụng App Password

#### 3. Port đã được sử dụng

```
Error: listen EADDRINUSE :::3000
```

**Giải pháp**: Thay đổi `APP_PORT` trong file `.env`

#### 4. JWT Secret không được set

```
Error: secretOrPrivateKey must have a value
```

**Giải pháp**: Đặt `JWT_SECRET` trong file `.env`

### Debug Mode

Để bật debug mode, thay đổi trong file `.env`:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

### Logs

Logs được lưu trong thư mục `logs/` với các mức độ:

- `error.log`: Lỗi hệ thống
- `combined.log`: Tất cả logs
- `access.log`: HTTP requests

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Giới hạn request
- **JWT**: Token-based authentication
- **Input Validation**: Joi validation
- **Password Hashing**: bcrypt

## 📦 Deployment

### Environment Variables cho Production

```env
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=3000
LOG_LEVEL=warn
```

**Lưu ý**: Đảm bảo file `.env` và `serviceAccountKey.json` không được commit vào Git!
