# 🚂 Hướng Dẫn Deploy Reading Book API trên Railway

> Hướng dẫn chi tiết deploy ứng dụng Reading Book API lên Railway platform

## 📋 Mục lục

- [Chuẩn bị](#-chuẩn-bị)
- [Deploy trên Railway](#-deploy-trên-railway)
- [Cấu hình Environment Variables](#-cấu-hình-environment-variables)
- [Kiểm tra sau deploy](#-kiểm-tra-sau-deploy)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Chuẩn bị

### Bước 1: Cấu hình Firebase

1. **Tạo Firebase Project:**
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Đặt tên project: `reading-book-api`
   - Bật Google Analytics (tùy chọn)

2. **Bật Realtime Database:**
   - Vào "Realtime Database" > "Create Database"
   - Chọn "Start in test mode"
   - Chọn region gần nhất (asia-southeast1)

3. **Bật Authentication:**
   - Vào "Authentication" > "Get started"
   - Tab "Sign-in method" > Bật "Email/Password"

4. **Tạo Service Account:**
   - Vào "Project Settings" > "Service accounts"
   - Click "Generate new private key"
   - Download file JSON

### Bước 2: Cấu hình Email Service

**Option A: Gmail (Miễn phí)**
1. Bật 2-Factor Authentication
2. Tạo App Password
3. Sử dụng App Password thay vì mật khẩu thường

**Option B: SendGrid (Khuyến nghị)**
1. Tạo tài khoản SendGrid
2. Tạo API Key
3. Verify sender email

### Bước 3: Chuẩn bị Environment Variables

Các biến môi trường cần thiết cho Railway:

```env
# ===========================================
# CẤU HÌNH CƠ BẢN
# ===========================================
NODE_ENV=production
APP_NAME=Reading Book API
APP_HOST=0.0.0.0
APP_PORT=$PORT
API_VERSION=v1
API_PREFIX=/api
LOG_LEVEL=info

# ===========================================
# FIREBASE CONFIGURATION
# ===========================================
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# ===========================================
# SECURITY
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=24h
RATE_LIMIT=100
RATE_LIMIT_WINDOW=15
CORS_ORIGIN=https://yourdomain.com

# ===========================================
# OTHER SETTINGS
# ===========================================
OTP_LENGTH=6
OTP_EXPIRY=300
OTP_PROVIDER=email
CACHE_TTL=300
UPLOAD_LIMIT=10mb
ALLOWED_FORMATS=jpg,jpeg,png,pdf,epub
STORAGE_PATH=uploads/
```

---

## 🚂 Deploy trên Railway

### Bước 1: Cài đặt Railway CLI

```bash
# Cài đặt Railway CLI
npm install -g @railway/cli

# Hoặc sử dụng yarn
yarn global add @railway/cli
```

### Bước 2: Đăng nhập Railway

```bash
# Đăng nhập Railway
railway login

# Chọn GitHub để đăng nhập
# Mở browser và authorize Railway
```

### Bước 3: Khởi tạo Project

```bash
# Trong thư mục dự án
railway init

# Chọn "Empty Project"
# Chọn "Deploy from GitHub repo"
# Chọn repository của bạn
```

### Bước 4: Deploy

```bash
# Deploy lần đầu
railway up

# Hoặc deploy từ GitHub
railway deploy
```

### Bước 5: Cấu hình Environment Variables

1. Vào [Railway Dashboard](https://railway.app/dashboard)
2. Chọn project của bạn
3. Vào tab "Variables"
4. Thêm các biến môi trường:

```
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=$PORT
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-key
EMAIL_FROM=noreply@yourdomain.com
CORS_ORIGIN=https://yourdomain.com
OTP_LENGTH=6
OTP_EXPIRY=300
OTP_PROVIDER=email
CACHE_TTL=300
UPLOAD_LIMIT=10mb
ALLOWED_FORMATS=jpg,jpeg,png,pdf,epub
STORAGE_PATH=uploads/
```

### Bước 6: Kiểm tra

```bash
# Xem logs
railway logs

# Xem URL
railway domain

# Xem trạng thái
railway status
```

---

## ✅ Kiểm tra sau deploy

### Bước 1: Health Check

```bash
# Lấy URL của app
railway domain

# Test health check
curl https://your-app.railway.app/api/v1/health
```

### Bước 2: Test Firebase Connection

```bash
# Test với Firebase token
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     https://your-app.railway.app/api/v1/users
```

### Bước 3: Test Email Service

```bash
# Test OTP endpoint
curl -X POST https://your-app.railway.app/api/v1/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
```

### Bước 4: Test Socket.io (nếu có)

```javascript
// Trong browser console
const socket = io('https://your-app.railway.app');
socket.on('connect', () => {
    console.log('Connected to server');
});
```

---

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. Firebase Connection Error

```bash
# Kiểm tra environment variables trong Railway dashboard
# Đảm bảo FIREBASE_PRIVATE_KEY có đúng format với \n
```

#### 2. Email Service Error

```bash
# Kiểm tra SMTP settings
# Đảm bảo SMTP_PASSWORD là API key chứ không phải password
```

#### 3. Port Error

```bash
# Railway tự động set PORT environment variable
# Đảm bảo APP_PORT=$PORT trong Railway dashboard
```

#### 4. Build Error

```bash
# Kiểm tra package.json có script "start"
# Kiểm tra logs trong Railway dashboard
```

### Commands hữu ích:

```bash
# Xem logs real-time
railway logs --follow

# Restart service
railway restart

# Xem metrics
railway metrics

# Connect to service
railway connect

# Deploy từ local
railway up

# Deploy từ GitHub
railway deploy
```

---

## 📊 Monitoring

### Railway Dashboard Features:

1. **Metrics**: CPU, Memory, Network usage
2. **Logs**: Real-time application logs
3. **Variables**: Environment variables management
4. **Deployments**: Deployment history
5. **Domains**: Custom domain management

### Health Monitoring:

```bash
# Setup monitoring script
#!/bin/bash
while true; do
    curl -f https://your-app.railway.app/api/v1/health || echo "Health check failed"
    sleep 60
done
```

---

## 🚀 Advanced Configuration

### Custom Domain:

1. Vào Railway Dashboard > Settings > Domains
2. Thêm custom domain
3. Cấu hình DNS records
4. Update CORS_ORIGIN environment variable

### Scaling:

```bash
# Railway tự động scale dựa trên traffic
# Có thể cấu hình trong dashboard
```

### Database:

```bash
# Railway cung cấp PostgreSQL, MySQL, Redis
# Có thể add database service trong dashboard
```

---

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/issues)

---

**Made with ❤️ by Reading Book Team**
