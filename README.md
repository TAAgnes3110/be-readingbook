# 📚 Reading Book API - Backend System

> **Fliply** - Hệ thống backend API cho ứng dụng đọc sách điện tử với Firebase Authentication, Socket.io, OTP, quản lý sách yêu thích và hỗ trợ EPUB.

## 🎯 Tổng quan

**Reading Book API** là hệ thống backend hoàn chỉnh cho ứng dụng đọc sách điện tử, cung cấp các tính năng xác thực, quản lý người dùng, quản lý sách, đọc EPUB và nhiều tính năng khác.

### ✨ Tính năng chính

- 🔐 **Authentication**: Đăng ký, đăng nhập, OTP, quên mật khẩu
- 👤 **User Management**: Quản lý thông tin người dùng, sách yêu thích
- 📖 **Book Management**: Tìm kiếm, phân loại, quản lý sách
- 📚 **EPUB Support**: Đọc và xử lý sách điện tử EPUB
- 📝 **Reading History**: Lịch sử đọc, bookmark, tiến độ
- 💬 **Feedback System**: Đánh giá và phản hồi
- 🛡️ **Admin Panel**: Quản lý hệ thống cho admin
- 🔄 **Real-time**: Socket.io cho tính năng real-time
- 📧 **Email Service**: Gửi email OTP, thông báo

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🔧 Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Firebase Project**: Cho Authentication và Firestore
- **Resend Account**: Miễn phí để gửi email (thay thế SMTP)
- **Render Account**: Để deploy miễn phí (không cần credit card)

## 🚀 Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd be-readingbook

# Cài đặt dependencies
npm install

# Tạo file môi trường
cp env.example .env

# Chỉnh sửa .env với thông tin thực tế
nano .env
```

## ⚙️ Cấu hình

### Biến môi trường cần thiết

```env
# App Configuration
NODE_ENV=development
APP_NAME=Reading Book API
APP_HOST=localhost
APP_PORT=3000
API_VERSION=v1
API_PREFIX=/api

# Firebase Configuration (BẮT BUỘC)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Email Configuration (BẮT BUỘC)
# Sử dụng Resend API (miễn phí, không bị chặn trên Render)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Cấu hình Firebase

1. Tạo project Firebase mới
2. Bật Authentication (Email/Password)
3. Tạo service account và download JSON key
4. Cập nhật các biến `FIREBASE_*` trong `.env`

### Cấu hình Email (Resend API)

1. Đăng ký miễn phí tại: https://resend.com/signup
2. Lấy API Key tại: https://resend.com/api-keys
3. Copy API key và thêm vào file `.env`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM=onboarding@resend.dev
   ```
4. **Free tier**: 100 emails/ngày, 3,000 emails/tháng

## 🏃‍♂️ Chạy ứng dụng

### Development

```bash
# Chạy development server
npm run dev

# Server sẽ chạy tại: http://localhost:3000
# API endpoint: http://localhost:3000/api
```

### Production

```bash
# Build và chạy production
npm run build
npm run production
```

### Scripts hữu ích

```bash
npm run lint          # Kiểm tra lint
npm run lint:fix       # Tự động sửa lint
npm run build          # Build Babel
npm run test           # Chạy tests
```

## 📖 API Documentation

### Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### API Endpoints

#### 🔐 Authentication APIs
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify-otp` - Xác thực OTP
- `POST /api/auth/resend-otp` - Gửi lại OTP
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/logout` - Đăng xuất

#### 👤 User APIs
- `GET /api/users` - Lấy thông tin user theo email
- `GET /api/users/:userId` - Lấy thông tin user theo ID
- `PUT /api/users/:userId` - Cập nhật thông tin user
- `GET /api/users/:userId/favorites` - Lấy sách yêu thích
- `POST /api/users/:userId/favorites/:bookId` - Thêm sách yêu thích
- `DELETE /api/users/:userId/favorites/:bookId` - Xóa sách yêu thích

#### 📚 Book APIs
- `GET /api/books` - Lấy danh sách sách (có filter, phân trang)
- `GET /api/books/latest` - Lấy sách mới nhất
- `GET /api/books/:id` - Lấy sách theo ID
- `GET /api/books/search` - Tìm kiếm sách

#### 📂 Category APIs
- `GET /api/categories` - Lấy tất cả danh mục
- `GET /api/categories/:categoryId` - Lấy danh mục theo ID

#### 📖 EPUB APIs
- `POST /api/epub/metadata` - Lấy metadata sách EPUB
- `POST /api/epub/chapters` - Lấy danh sách chương
- `POST /api/epub/chapter-content` - Lấy nội dung chương
- `POST /api/epub/validate-url` - Kiểm tra URL EPUB hợp lệ
- `POST /api/epub/chapter-raw` - Lấy nội dung raw của chương
- `POST /api/epub/image` - Lấy ảnh từ EPUB
- `POST /api/epub/file` - Lấy file từ EPUB
- `POST /api/epub/images` - Lấy danh sách ảnh

#### 📝 History APIs
- `POST /api/history/bookmark` - Lưu bookmark
- `GET /api/history/:userId` - Lấy lịch sử đọc theo user
- `GET /api/history/:userId/bookmark/:bookId` - Lấy bookmark cụ thể
- `DELETE /api/history/:userId/bookmark/:bookId` - Xóa bookmark
- `GET /api/history/user/:userId` - Lấy lịch sử theo user
- `GET /api/history/book/:bookId` - Lấy lịch sử theo sách

#### 💬 Feedback APIs
- `POST /api/feedback` - Tạo feedback
- `GET /api/feedback/my-feedbacks` - Lấy feedback của user
- `GET /api/feedback/:id` - Lấy feedback theo ID
- `PUT /api/feedback/:id` - Cập nhật feedback
- `DELETE /api/feedback/:id` - Xóa feedback

#### 🛡️ Admin APIs
- `POST /api/admin/categories` - Tạo danh mục mới
- `PUT /api/admin/categories/:categoryId` - Cập nhật danh mục
- `DELETE /api/admin/categories/:categoryId` - Xóa danh mục
- `POST /api/admin/books` - Tạo sách mới
- `PUT /api/admin/books/:id` - Cập nhật sách
- `DELETE /api/admin/books/:id` - Xóa sách
- `GET /api/admin/users` - Quản lý người dùng

### Quick Start Example

```bash
# Đăng ký tài khoản mới
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "username": "nguyenvana",
    "phoneNumber": "0123456789"
  }'

# Đăng nhập
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Lấy danh sách sách
curl -X GET "http://localhost:3000/api/books?page=1&limit=10" \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

## 📁 Cấu trúc dự án

```
be-readingbook/
├── 📁 src/                          # Source code chính
│   ├── 📄 app.js                   # Express app configuration
│   ├── 📄 index.js                  # Entry point
│   ├── 📁 config/                   # Configuration files
│   │   ├── 📄 config.js            # App configuration
│   │   ├── 📄 db.js                # Database connection
│   │   ├── 📄 logger.js             # Logging configuration
│   │   ├── 📄 morgan.js             # HTTP request logging
│   │   ├── 📄 passport.js           # Firebase authentication
│   │   └── 📄 role.js               # Role-based access control
│   ├── 📁 controllers/              # Request handlers
│   │   ├── 📄 authController.js    # Authentication logic
│   │   ├── 📄 userController.js     # User management
│   │   ├── 📄 bookController.js    # Book operations
│   │   ├── 📄 categoriesController.js # Category operations
│   │   ├── 📄 epubController.js    # EPUB processing
│   │   ├── 📄 historyController.js # Reading history
│   │   └── 📄 feedbackController.js # User feedback
│   ├── 📁 middlewares/             # Custom middlewares
│   │   ├── 📄 authMiddleware.js     # JWT authentication
│   │   ├── 📄 authorize.js         # Role authorization
│   │   ├── 📄 softDeleteMiddleware.js # Soft delete handling
│   │   └── 📄 validate.js          # Request validation
│   ├── 📁 models/                   # Data models
│   │   ├── 📄 userModel.js         # User data model
│   │   ├── 📄 bookModel.js          # Book data model
│   │   ├── 📄 categoryModel.js     # Category data model
│   │   ├── 📄 historyModel.js      # Reading history model
│   │   └── 📄 feedbackModel.js     # Feedback model
│   ├── 📁 routes/                   # API routes
│   │   ├── 📄 authRoute.js         # Authentication routes
│   │   ├── 📄 userRoute.js         # User routes
│   │   ├── 📄 bookRoute.js         # Book routes
│   │   ├── 📄 categoriesRoute.js   # Category routes
│   │   ├── 📄 epubRoute.js         # EPUB routes
│   │   ├── 📄 historyRoute.js      # History routes
│   │   ├── 📄 feedbackRoute.js     # Feedback routes
│   │   └── 📄 index.js             # Route aggregator
│   ├── 📁 services/                 # Business logic
│   │   ├── 📄 authService.js       # Authentication service
│   │   ├── 📄 userService.js       # User service
│   │   ├── 📄 bookService.js       # Book service
│   │   ├── 📄 categoriesService.js # Category service
│   │   ├── 📄 epubService.js       # EPUB service
│   │   ├── 📄 historyService.js    # History service
│   │   ├── 📄 feedbackService.js   # Feedback service
│   │   ├── 📄 emailService.js      # Email service
│   │   ├── 📄 otpService.js        # OTP service
│   │   ├── 📄 tokenService.js      # JWT service
│   │   └── 📄 firebaseService.js   # Firebase service
│   ├── 📁 validations/              # Request validation schemas
│   │   ├── 📄 authValidation.js    # Auth validation
│   │   ├── 📄 userValidation.js     # User validation
│   │   ├── 📄 bookValidation.js    # Book validation
│   │   ├── 📄 categoriesValidation.js # Category validation
│   │   ├── 📄 epubValidation.js    # EPUB validation
│   │   ├── 📄 historyValidation.js # History validation
│   │   └── 📄 feedbackValidation.js # Feedback validation
│   ├── 📁 providers/                # External service providers
│   │   ├── 📄 emailProvider.js     # Email provider
│   │   ├── 📄 otpProvider.js       # OTP provider
│   │   └── 📄 userProvider.js       # User provider
│   ├── 📁 sockets/                  # Socket.io handlers
│   │   ├── 📄 connection.js        # Socket connection
│   │   ├── 📄 auth.js              # Socket authentication
│   │   └── 📄 events.js            # Socket events
│   ├── 📁 upload/                   # File upload handling
│   │   ├── 📄 multer.js            # Multer configuration
│   │   └── 📄 storage.js            # Storage configuration
│   └── 📁 utils/                    # Utility functions
│       ├── 📄 catchAsync.js         # Async error handling
│       ├── 📄 response.js           # API response helpers
│       ├── 📄 validation.js         # Validation helpers
│       ├── 📄 encryption.js         # Encryption utilities
│       ├── 📄 date.js              # Date utilities
│       └── 📄 index.js             # Utility aggregator
├── 📁 admin/                        # Admin panel APIs
│   ├── 📁 controllers/              # Admin controllers
│   ├── 📁 routes/                   # Admin routes
│   ├── 📁 services/                 # Admin services
│   ├── 📁 middlewares/              # Admin middlewares
│   └── 📁 validations/              # Admin validations
├── 📁 docs_api/                     # API documentation
│   ├── 📄 SIMPLE_AUTH_API.md       # Authentication API docs
│   ├── 📄 SIMPLE_USER_API.md       # User API docs
│   ├── 📄 SIMPLE_BOOK_API.md       # Book API docs
│   ├── 📄 SIMPLE_CATEGORY_API.md   # Category API docs
│   ├── 📄 SIMPLE_EPUB_API.md       # EPUB API docs
│   ├── 📄 FAVORITE_BOOKS_API.md    # Favorite books API docs
│   ├── 📄 HISTORY_API.md           # History API docs
│   ├── 📄 FEEDBACK_API.md          # Feedback API docs
│   └── 📄 SOFT_DELETE_STRATEGY.md  # Soft delete strategy
├── 📁 uploads/                      # Uploaded files
├── 📄 package.json                 # Dependencies và scripts
├── 📄 env.example                  # Environment variables example
└── 📄 README.md                    # This file
```

## 🛡️ Security

### Authentication & Authorization
- **Firebase Authentication**: Email/password, OTP verification
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: User và Admin roles
- **Password Hashing**: bcrypt với salt rounds

### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries

### Data Protection
- **Environment Variables**: Sensitive data in .env
- **Firebase Security Rules**: Database access control
- **HTTPS**: SSL/TLS encryption
- **Data Encryption**: Sensitive data encryption

## 📦 Deployment

### ⚡ CI/CD Pipeline (Khuyên dùng - Tự động)

Dự án đã được setup **CI/CD tự động** với GitHub Actions. Chỉ cần push code là tự động deploy!

**Xem hướng dẫn chi tiết:** [CI_CD.md](CI_CD.md)

#### Quick Start CI/CD

1. **Tạo Fly.io API Token**:
   ```bash
   flyctl auth login
   flyctl tokens create deploy -x 999999h
   ```

2. **Thêm Secret vào GitHub**:
   - Vào repository → Settings → Secrets and variables → Actions
   - Thêm secret: `FLY_API_TOKEN` với giá trị token vừa tạo

3. **Push code và tự động deploy**:
   ```bash
   git push origin main
   ```
   - Pipeline tự động chạy test → deploy lên Fly.io
   - Xem progress tại tab **Actions** trên GitHub

#### Tính năng CI/CD

- ✅ **Tự động test**: Chạy linter và tests trước khi deploy
- ✅ **Tự động deploy**: Deploy lên Fly.io khi push vào `main`
- ✅ **Docker caching**: Build nhanh hơn 2-3 lần
- ✅ **Bảo mật**: Chạy container với user không phải root
- ✅ **Health check**: Tự động kiểm tra sức khỏe ứng dụng

**Xem chi tiết:** [CI_CD.md](CI_CD.md)

---

### 🚀 Deploy lên Render.com (ĐỀ XUẤT - Miễn phí)

Dự án này được cấu hình tối ưu để deploy lên **Render.com** - nền tảng miễn phí, không cần credit card.

**Xem hướng dẫn chi tiết:** [DEPLOYMENT.md](DEPLOYMENT.md)

#### Quick Start

1. **Đăng ký Render**: https://render.com (Miễn phí)
2. **Lấy Resend API Key**: https://resend.com/signup (Miễn phí)
3. **Deploy**:
   - New Web Service → Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables (xem DEPLOYMENT.md)

#### Environment Variables cần thiết

```env
# Node Environment
NODE_ENV=production

# Email via Resend (BẮT BUỘC)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=24h

# Firebase (BẮT BUỘC)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
# ... các biến Firebase khác

# CORS
CORS_ORIGIN=*
```

#### Lưu ý về Render Free Tier

- ✅ Hoàn toàn miễn phí, không cần credit card
- ✅ SSL certificate tự động
- ⚠️ Server sleep sau 15 phút không hoạt động
- ⚠️ Cold start ~30-60 giây

**Giải pháp cho sleep issue:**
- Setup uptime monitoring (https://cron-job.org) để ping `/health` mỗi 10 phút
- Hoặc upgrade lên Starter plan ($7/tháng) - không sleep

**Deployment URL:** `https://your-app-name.onrender.com`

## 🔧 Troubleshooting

### Common Issues

#### Port đang được sử dụng
```bash
# Kiểm tra port đang sử dụng
netstat -tulpn | grep :3000

# Thay đổi port trong .env
APP_PORT=3001
```

#### Firebase Authentication lỗi
```bash
# Kiểm tra Firebase configuration
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_PRIVATE_KEY

# Test Firebase connection
npm run test:firebase
```

#### Email không gửi được
```bash
# Kiểm tra Resend API key
echo $RESEND_API_KEY

# Xem logs để kiểm tra
# Logs nên hiển thị: "📧 Using Resend API for email delivery"
# Nếu thấy lỗi SMTP, đảm bảo đã set RESEND_API_KEY
```

#### JWT Token lỗi
```bash
# Kiểm tra JWT secret
echo $JWT_SECRET

# Test JWT generation
npm run test:jwt
```

### Logs và Debugging

```bash
# Xem logs development
npm run dev

# Xem logs production
npm run production

# Debug mode
DEBUG=* npm run dev
```

### Performance Monitoring

```bash
# Memory usage
npm run monitor:memory

# CPU usage
npm run monitor:cpu

# Database performance
npm run monitor:db
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

## 👥 Team

| Tên           | Mã Sinh Viên | Vai Trò            |
| ------------- | ------------ | ------------------ |
| Bùi Thanh Phú | 223630702    | Project Management |
| Bùi Đức Anh   | 223630666    | Tester             |
| Vũ Tuấn Kiệt  | 223630694    | Backend            |
| Vũ Quyết Tiến | 223630716    | Frontend           |
| Đỗ Hoàng Tùng | 223630721    | DevOps             |

## 📞 Support

- **Email**: support@readingbook.com
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/issues)
- **Documentation**: [API Docs](docs_api/)

---

**Made with ❤️ by Reading Book Team**
