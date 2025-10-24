# 📚 Reading Book API

> Backend API cho ứng dụng đọc sách: Firebase Auth, Socket.io, OTP, sách yêu thích, EPUB.

## ✨ Tính năng

- 🔐 Authentication (Đăng ký/Đăng nhập/OTP)
- 👤 Quản lý người dùng
- 📖 Quản lý sách, thể loại
- ❤️ Sách yêu thích
- 📨 Email service (SMTP/Gmail)
- 🔄 Socket.io real-time
- 🐳 Docker compose
- 🛡️ JWT, rate limit, validation

## 📋 Mục lục

- **Yêu cầu hệ thống**
- **Cài đặt**
- **Cấu hình .env**
- **Chạy ứng dụng**
- **Docker**
- **API Documentation**
- **Cấu trúc dự án**
- **Troubleshooting**
- **Security**
- **Deployment**

## 🔧 Yêu cầu hệ thống

- Node.js >= 18.x, npm >= 9.x
- Firebase project (Authentication)
- Tài khoản email (hoặc SMTP server)

## 🚀 Cài đặt

```bash
git clone <repository-url>
cd be-readingbook
npm install

# Tạo file môi trường
cp env.example .env
# Chỉnh sửa .env với giá trị thực tế
```

## ⚙️ Cấu hình .env (rút gọn)

```env
# App
NODE_ENV=development
APP_NAME=Reading Book API
APP_HOST=localhost
APP_PORT=3000
API_VERSION=v1
API_PREFIX=/api

# Firebase (bắt buộc)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key

# Email (bắt buộc)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=24h
```

Xem đầy đủ biến môi trường trong `env.example` và `env.docker.example`.

## 🏃‍♂️ Chạy ứng dụng

- Development:

```bash
npm run dev
```

Server mặc định chạy tại: `http://localhost:3000/api` (theo `API_PREFIX=/api`).

- Production (local):

```bash
npm run production
```

### Lệnh hữu ích

```bash
npm run lint       # kiểm tra lint
npm run lint:fix   # tự sửa lint
npm run build      # build Babel vào build/src
```

## 🐳 Docker

Các script đã có sẵn trong `package.json`:

```bash
npm run docker:dev    # docker-compose.dev.yml (foreground)
npm run docker:prod   # docker-compose.prod.yml (detached)
npm run docker:down   # dừng toàn bộ compose
npm run docker:logs   # xem logs service 'app'

# Image/container đơn lẻ
npm run docker:build  # build image reading-book-api
npm run docker:run    # chạy container map port 9000
```

- Mặc định cho Docker: `APP_PORT=9000` (xem `env.docker.example`).

## 📖 API Documentation

- Base URL: `http://localhost:3000/api` (dev) hoặc `http://localhost:9000/api` (Docker)
- Tài liệu chi tiết trong thư mục `docs_api/`:
  - `docs_api/SIMPLE_AUTH_API.md`
  - `docs_api/SIMPLE_USER_API.md`
  - `docs_api/SIMPLE_BOOK_API.md`
  - `docs_api/SIMPLE_CATEGORY_API.md`
  - `docs_api/FAVORITE_BOOKS_API.md`
  - `docs_api/SIMPLE_EPUB_API.md`

Quick start:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123","fullName":"Nguyễn Văn A","username":"nguyenvana","phoneNumber":"0123456789"}'
```

## 📁 Cấu trúc dự án (rút gọn)

```
src/
├── app.js
├── index.js
├── config/
├── controllers/
├── middlewares/
├── models/
├── providers/
├── routes/
├── services/
├── sockets/
├── upload/
├── utils/
└── validations/
```

## 🔧 Troubleshooting

- Port đang dùng: đổi `APP_PORT` trong `.env`.
- Firebase lỗi cấu hình: kiểm tra `FIREBASE_*` trong `.env`.
- Email không gửi: xác minh `SMTP_USERNAME/PASSWORD` và App Password.
- JWT lỗi secret: đặt `JWT_SECRET` trong `.env`.

## 🛡️ Security

- Helmet, CORS, Rate limiting, JWT, Joi validation, bcrypt.

## 📦 Deployment

Production gợi ý biến môi trường:

```env
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=9000
LOG_LEVEL=warn
```

Lưu ý: Không commit `.env` và khóa Firebase vào Git.
