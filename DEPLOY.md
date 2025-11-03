# 🚀 Hướng dẫn Deploy lên Fly.io

Hướng dẫn chi tiết để deploy ứng dụng Reading Book API lên Fly.io.

## 📋 Yêu cầu trước khi deploy

1. **Cài đặt Fly CLI**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

   # Mac/Linux
   curl -L https://fly.io/install.sh | sh

   # Hoặc dùng npm
   npm install -g @fly/cli
   ```

2. **Đăng ký tài khoản Fly.io**
   - Truy cập: https://fly.io/app/sign-up
   - Đăng ký bằng GitHub hoặc email

## 🔐 Bước 1: Đăng nhập Fly.io

```bash
flyctl auth login
```

Lệnh này sẽ mở trình duyệt để bạn đăng nhập. Sau khi đăng nhập thành công, bạn sẽ được xác thực.

## 📦 Bước 2: Khởi tạo ứng dụng (nếu chưa có)

Nếu bạn đã có file `fly.toml`, có thể bỏ qua bước này. Nếu chưa có, chạy:

```bash
flyctl launch --no-deploy
```

Lệnh này sẽ:
- Tạo file `fly.toml` với cấu hình mặc định
- Tạo ứng dụng mới trên Fly.io
- Không deploy ngay (vì bạn cần set secrets trước)

## 🔑 Bước 3: Thiết lập Secrets (Biến môi trường)

Thiết lập tất cả các biến môi trường bắt buộc. **LƯU Ý**: Với Fly.io, bạn có thể set từng biến hoặc từ file `.env`.

### Cách 1: Set từng biến (Khuyên dùng)

```bash
# Cấu hình App
flyctl secrets set NODE_ENV=production
flyctl secrets set APP_NAME="Reading Book API"
flyctl secrets set APP_HOST=0.0.0.0
flyctl secrets set APP_PORT=3000
flyctl secrets set API_VERSION=v1
flyctl secrets set API_PREFIX=/api

# Cấu hình Firebase (BẮT BUỘC)
flyctl secrets set FIREBASE_PROJECT_ID=your-project-id
flyctl secrets set FIREBASE_PROJECT_NUMBER=your-project-number
flyctl secrets set FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app/
flyctl secrets set FIREBASE_WEB_API_KEY=your-web-api-key
flyctl secrets set FIREBASE_PRIVATE_KEY_ID=your-private-key-id
flyctl secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-private-key...\n-----END PRIVATE KEY-----\n"
flyctl secrets set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
flyctl secrets set FIREBASE_CLIENT_ID=your-client-id

# Cấu hình Email SMTP (BẮT BUỘC)
flyctl secrets set SMTP_HOST=smtp.gmail.com
flyctl secrets set SMTP_PORT=465
flyctl secrets set SMTP_USERNAME=your@gmail.com
flyctl secrets set SMTP_PASSWORD=your-app-password-16-chars
flyctl secrets set EMAIL_FROM=your@gmail.com

# Cấu hình JWT (BẮT BUỘC)
flyctl secrets set JWT_SECRET=your-super-secret-jwt-key-here
flyctl secrets set JWT_EXPIRY=24h

# Cấu hình CORS
flyctl secrets set CORS_ORIGIN=https://your-frontend-domain.com
flyctl secrets set CORS_METHODS=GET,POST,PUT,DELETE,PATCH
flyctl secrets set CORS_CREDENTIALS=true

# Cấu hình OTP
flyctl secrets set OTP_LENGTH=6
flyctl secrets set OTP_EXPIRY=300
flyctl secrets set OTP_PROVIDER=email

# Cấu hình Rate Limit
flyctl secrets set RATE_LIMIT=100
flyctl secrets set RATE_LIMIT_WINDOW=15

# Cấu hình Logging
flyctl secrets set LOG_LEVEL=info
flyctl secrets set LOG_FORMAT=combined
```

### Cách 2: Set từ file .env (Tiện lợi hơn)

Tạo file `.env.production` với tất cả các biến môi trường, sau đó:

```bash
# Export tất cả biến từ file .env và set vào Fly.io
# (Không hỗ trợ trực tiếp, phải set từng biến)
```

### Kiểm tra secrets đã set

```bash
flyctl secrets list
```

## 🚀 Bước 4: Deploy ứng dụng

### Deploy lần đầu

```bash
flyctl deploy
```

Lệnh này sẽ:
- Build Docker image từ `Dockerfile`
- Push image lên Fly.io
- Deploy và khởi động ứng dụng
- Hiển thị URL của ứng dụng

### Deploy lại (sau khi thay đổi code)

```bash
# Commit code lên Git trước
git add .
git commit -m "Update code"
git push origin main

# Deploy lên Fly.io
flyctl deploy
```

### Deploy với remote builder (Nhanh hơn)

```bash
flyctl deploy --remote-only
```

## 📊 Bước 5: Kiểm tra và quản lý

### Xem logs

```bash
# Xem logs real-time
flyctl logs

# Xem logs và follow
flyctl logs -a readingbook-api-cold-hill-3738
```

### Kiểm tra status

```bash
flyctl status
```

### Mở SSH vào máy chủ

```bash
flyctl ssh console
```

### Xem thông tin app

```bash
flyctl info
```

### Mở ứng dụng trên trình duyệt

```bash
flyctl open
```

## 🔄 Các lệnh deploy thường dùng

### Deploy nhanh (Sau khi đã setup xong)

```bash
flyctl deploy --remote-only
```

### Deploy với build local

```bash
flyctl deploy --local-only
```

### Deploy và mở ngay sau khi xong

```bash
flyctl deploy --open
```

### Deploy với image cụ thể

```bash
flyctl deploy --image your-image-name
```

## 🛠️ Quản lý Secrets

### Xem tất cả secrets

```bash
flyctl secrets list
```

### Xóa một secret

```bash
flyctl secrets unset SECRET_NAME
```

### Set nhiều secrets cùng lúc

```bash
flyctl secrets set KEY1=value1 KEY2=value2 KEY3=value3
```

## 🔍 Troubleshooting

### Lỗi build Docker

```bash
# Test build local trước
docker build -t readingbook-api .
docker run -p 3000:3000 readingbook-api
```

### Lỗi kết nối Firebase

- Kiểm tra lại các secrets Firebase đã được set đúng chưa
- Đảm bảo `FIREBASE_PRIVATE_KEY` có đầy đủ `\n` (newlines)

### Lỗi email không gửi được

- Kiểm tra SMTP credentials
- Đảm bảo đã tạo App Password cho Gmail (nếu dùng Gmail)

### Xem logs chi tiết

```bash
# Xem logs từ đầu
flyctl logs -a readingbook-api-cold-hill-3738

# Xem logs và filter
flyctl logs -a readingbook-api-cold-hill-3738 | grep ERROR

# Xem logs của region cụ thể
flyctl logs -a readingbook-api-cold-hill-3738 --region sin
```

### Restart ứng dụng

```bash
flyctl apps restart readingbook-api-cold-hill-3738
```

### Scale ứng dụng

```bash
# Tăng số lượng máy chủ
flyctl scale count 2

# Thay đổi memory
flyctl scale memory 2048

# Xem thông tin scale hiện tại
flyctl scale show
```

## 📝 Lệnh deploy đơn giản nhất (Quick Start)

Sau khi đã setup xong, mỗi lần deploy chỉ cần:

```bash
flyctl deploy --remote-only
```

Hoặc tạo alias để tiện hơn:

```bash
# Thêm vào ~/.bashrc hoặc ~/.zshrc
alias deploy='flyctl deploy --remote-only'

# Sau đó chỉ cần gõ:
deploy
```

## 🌐 URL ứng dụng sau khi deploy

Sau khi deploy thành công, ứng dụng sẽ có URL:

```
https://readingbook-api-cold-hill-3738.fly.dev
```

API endpoint:
```
https://readingbook-api-cold-hill-3738.fly.dev/api
```

Health check:
```
https://readingbook-api-cold-hill-3738.fly.dev/health
```

## 📌 Lưu ý quan trọng

1. **Private Key**: Khi set `FIREBASE_PRIVATE_KEY`, phải giữ nguyên format với `\n`:
   ```
   "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

2. **CORS**: Nhớ update `CORS_ORIGIN` với domain frontend thực tế

3. **Health Check**: Fly.io tự động check endpoint `/health` mỗi 30 giây

4. **Auto Stop**: App sẽ tự động stop sau 15 phút không có traffic (free tier)

5. **Cost**: Fly.io free tier có giới hạn, xem tại: https://fly.io/docs/about/pricing/

## 🔗 Liên kết hữu ích

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly CLI Reference](https://fly.io/docs/flyctl/)
- [Fly.io Pricing](https://fly.io/docs/about/pricing/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

**Happy Deploying! 🚀**

