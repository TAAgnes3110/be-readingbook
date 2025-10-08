# 📚 Reading Book API

> API Backend cho ứng dụng đọc sách với Firebase Authentication, Socket.io và quản lý sách yêu thích

## ✨ Tính năng chính

- 🔐 **Authentication**: Đăng ký, đăng nhập, xác thực OTP
- 👤 **User Management**: Quản lý thông tin người dùng
- 📖 **Book Management**: Quản lý sách và thể loại
- ❤️ **Favorite Books**: Hệ thống sách yêu thích
- 📧 **Email Service**: Gửi OTP và thông báo
- 🔄 **Real-time**: Socket.io cho real-time updates
- 🐳 **Docker Support**: Chạy với Docker
- 🛡️ **Security**: JWT, Rate limiting, Input validation

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [🐳 Docker](#docker)
- [📖 API Documentation](#api-documentation)
- [📁 Cấu trúc dự án](#cấu-trúc-dự-án)
- [🔧 Troubleshooting](#troubleshooting)
- [🛡️ Security Features](#security-features)
- [📦 Deployment](#deployment)

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
APP_PORT=9000
API_VERSION=v1
API_PREFIX=/api

# Firebase (BẮT BUỘC)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id

# Email (BẮT BUỘC)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# JWT (BẮT BUỘC)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=1h

# OTP Configuration
OTP_LENGTH=6
OTP_EXPIRY=300
OTP_PROVIDER=email

# Cache Configuration
CACHE_TTL=300
CACHE_CHECKPERIOD=120

# Upload Configuration
UPLOAD_LIMIT=5mb
ALLOWED_FORMATS=jpg,jpeg,png,pdf,epub
STORAGE_PATH=uploads/

# Rate Limiting
RATE_LIMIT=100
RATE_LIMIT_WINDOW=15

# CORS
CORS_ORIGIN=*
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined
```

## 🏃‍♂️ Chạy ứng dụng

### Development Mode

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:9000`

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

## 🐳 Docker

Dự án đã được cấu hình để chạy với Docker. Xem [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) để biết hướng dẫn chi tiết.

### Chạy nhanh với Docker

```bash
# Development mode
npm run docker:dev

# Production mode
npm run docker:prod

# Xem logs
npm run docker:logs

# Dừng ứng dụng
npm run docker:down
```

### Các lệnh Docker

```bash
# Build image
npm run docker:build

# Chạy container đơn lẻ
npm run docker:run

# Dọn dẹp Docker
npm run docker:clean
```

## 📖 API Documentation

### Base URL

```
http://localhost:9000/api
```

### 📚 Available APIs

- **[Auth API](./SIMPLE_AUTH_API.md)** - Authentication & User Management
- **[User API](./SIMPLE_USER_API.md)** - User Profile & Favorite Books
- **[Book API](./SIMPLE_BOOK_API.md)** - Book Management
- **[Category API](./SIMPLE_CATEGORY_API.md)** - Category Management
- **[Favorite Books API](./FAVORITE_BOOKS_API.md)** - User Favorite Books

### Quick Start Examples

#### 1. Đăng ký tài khoản

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

#### 2. Xác thực OTP

```bash
curl -X POST http://localhost:9000/api/auth/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

#### 3. Đăng nhập

```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### 4. Thêm sách yêu thích

```bash
curl -X POST http://localhost:9000/api/users/123456/favorites/book789 \
  -H 'Authorization: Bearer your_access_token_here'
```

#### 5. Lấy danh sách sách yêu thích

```bash
curl -X GET http://localhost:9000/api/users/123456/favorites \
  -H 'Authorization: Bearer your_access_token_here'
```

## 📁 Cấu trúc dự án

```
src/
├── app.js                    # Express app configuration
├── index.js                  # Server entry point
├── config/                   # Configuration files
│   ├── config.js            # Main config
│   ├── db.js                # Firebase database config
│   ├── index.js             # Config exports
│   ├── logger.js            # Winston logger
│   ├── morgan.js            # HTTP request logger
│   └── passport.js          # Passport strategies
├── controllers/              # Route controllers
│   ├── authController.js    # Authentication endpoints
│   ├── bookController.js    # Book management
│   ├── categoriesController.js # Category management
│   ├── epubController.js    # EPUB processing
│   ├── index.js             # Controller exports
│   └── userController.js    # User management & favorites
├── middlewares/              # Custom middlewares
│   ├── authMiddleware.js    # JWT authentication
│   └── validate.js          # Request validation
├── models/                   # Data models
│   ├── bookModel.js         # Book data model
│   ├── categoryModel.js     # Category data model
│   ├── index.js             # Model exports
│   └── userModel.js         # User data model
├── providers/                # External service providers
│   ├── emailProvider.js     # Email service provider
│   ├── index.js             # Provider exports
│   ├── otpProvider.js       # OTP service provider
│   └── userProvider.js      # User service provider
├── routes/                   # API routes
│   ├── authRoute.js         # Authentication routes
│   ├── bookRoute.js         # Book routes
│   ├── categoriesRoute.js   # Category routes
│   ├── epubRoute.js         # EPUB routes
│   ├── index.js             # Route exports
│   └── userRoute.js         # User & favorite routes
├── services/                 # Business logic
│   ├── authService.js       # Authentication logic
│   ├── bookService.js       # Book management logic
│   ├── categoriesService.js # Category logic
│   ├── emailService.js      # Email service
│   ├── epubService.js       # EPUB processing
│   ├── firebaseService.js   # Firebase operations
│   ├── index.js             # Service exports
│   ├── otpService.js        # OTP management
│   ├── tokenService.js      # JWT token management
│   └── userService.js       # User & favorites logic
├── sockets/                  # Socket.io handlers
│   ├── index.js             # Socket exports
│   ├── initialzationSocket.js # Socket initialization
│   └── userSocket.js        # User socket events
├── upload/                   # File upload utilities
│   ├── book_firebase.json   # Firebase book data
│   ├── categories.json      # Category data
│   ├── createCategories.js  # Category creation script
│   └── uploadToFirebase.js  # Firebase upload script
├── utils/                    # Utility functions
│   ├── ApiError.js          # Custom error class
│   ├── catchAsync.js        # Async error handler
│   ├── emailUtils.js        # Email utilities
│   ├── idUtils.js           # ID generation
│   ├── index.js             # Utility exports
│   ├── passwordUtils.js     # Password hashing
│   └── pick.js              # Object picking utility
└── validations/              # Input validation
    ├── authValidation.js    # Auth validation schemas
    ├── bookValidation.js    # Book validation schemas
    ├── categoriesValidation.js # Category validation
    ├── custom.js            # Custom validation rules
    ├── epubValidation.js    # EPUB validation
    ├── index.js             # Validation exports
    └── userValidation.js    # User validation schemas
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

#### 5. Circular Dependency Warnings

```
Warning: Accessing non-existent property 'config' of module exports inside circular dependency
```

**Giải pháp**: Đã được sửa trong code, không ảnh hưởng đến chức năng

#### 6. Cache Configuration Error

```
TypeError: Cannot read properties of undefined (reading 'cache')
```

**Giải pháp**: Đảm bảo `CACHE_TTL` được set trong file `.env` hoặc sử dụng giá trị mặc định

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
APP_PORT=9000
LOG_LEVEL=warn
```

**Lưu ý**: Đảm bảo file `.env` và `serviceAccountKey.json` không được commit vào Git!
