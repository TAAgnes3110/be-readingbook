# 🚀 Hướng Dẫn Deploy Reading Book API - Các Bước Chi Tiết

> Hướng dẫn từng bước deploy ứng dụng Reading Book API lên các nền tảng khác nhau

## 📋 **Mục lục**

1. [Chuẩn bị](#-chuẩn-bị)
2. [Deploy trên Heroku](#-deploy-trên-heroku)
3. [Deploy trên Railway](#-deploy-trên-railway)
4. [Deploy trên Vercel](#-deploy-trên-vercel)
5. [Deploy trên VPS/Server](#-deploy-trên-vpsserver)
6. [Kiểm tra sau deploy](#-kiểm-tra-sau-deploy)

---

## 🔧 **Chuẩn bị**

### **Bước 1: Cấu hình Firebase**

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

### **Bước 2: Cấu hình Email Service**

**Option A: Gmail (Miễn phí)**
1. Bật 2-Factor Authentication
2. Tạo App Password
3. Sử dụng App Password thay vì mật khẩu thường

**Option B: SendGrid (Khuyến nghị)**
1. Tạo tài khoản SendGrid
2. Tạo API Key
3. Verify sender email

### **Bước 3: Chuẩn bị Environment Variables**

Tạo file `.env` với nội dung:

```env
# ===========================================
# CẤU HÌNH CƠ BẢN
# ===========================================
NODE_ENV=production
APP_NAME=Reading Book API
APP_HOST=0.0.0.0
APP_PORT=9000
API_VERSION=v1
API_PREFIX=/api

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

## 🟣 **Deploy trên Heroku**

### **Bước 1: Cài đặt Heroku CLI**

**Windows:**
```bash
# Tải và cài đặt từ: https://devcenter.heroku.com/articles/heroku-cli
```

**Mac:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### **Bước 2: Đăng nhập Heroku**

```bash
heroku login
# Mở browser và đăng nhập
```

### **Bước 3: Tạo Heroku App**

```bash
# Tạo app mới
heroku create reading-book-api

# Hoặc tạo với tên cụ thể
heroku create your-app-name
```

### **Bước 4: Cấu hình Environment Variables**

```bash
# Cấu hình từng biến
heroku config:set NODE_ENV=production
heroku config:set APP_HOST=0.0.0.0
heroku config:set APP_PORT=$PORT
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
heroku config:set FIREBASE_WEB_API_KEY=your-web-api-key
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
heroku config:set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set SMTP_HOST=smtp.sendgrid.net
heroku config:set SMTP_USERNAME=apikey
heroku config:set SMTP_PASSWORD=your-sendgrid-key
heroku config:set EMAIL_FROM=noreply@yourdomain.com
```

### **Bước 5: Deploy**

```bash
# Add và commit code
git add .
git commit -m "Deploy to Heroku"

# Deploy lên Heroku
git push heroku main

# Mở app
heroku open
```

### **Bước 6: Kiểm tra Logs**

```bash
# Xem logs real-time
heroku logs --tail

# Xem logs của app
heroku logs --app your-app-name
```

---

## 🚂 **Deploy trên Railway**

### **Bước 1: Cài đặt Railway CLI**

```bash
npm install -g @railway/cli
```

### **Bước 2: Đăng nhập Railway**

```bash
railway login
# Chọn GitHub để đăng nhập
```

### **Bước 3: Khởi tạo Project**

```bash
# Trong thư mục dự án
railway init

# Chọn "Empty Project"
# Chọn "Deploy from GitHub repo"
```

### **Bước 4: Deploy**

```bash
# Deploy
railway up

# Hoặc deploy từ GitHub
railway deploy
```

### **Bước 5: Cấu hình Environment Variables**

1. Vào [Railway Dashboard](https://railway.app/dashboard)
2. Chọn project của bạn
3. Vào tab "Variables"
4. Thêm các biến môi trường:

```
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=$PORT
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.sendgrid.net
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-key
EMAIL_FROM=noreply@yourdomain.com
```

### **Bước 6: Kiểm tra**

```bash
# Xem logs
railway logs

# Xem URL
railway domain
```

---

## ▲ **Deploy trên Vercel**

### **Bước 1: Cài đặt Vercel CLI**

```bash
npm install -g vercel
```

### **Bước 2: Đăng nhập Vercel**

```bash
vercel login
# Chọn GitHub để đăng nhập
```

### **Bước 3: Deploy**

```bash
# Deploy lần đầu
vercel

# Deploy production
vercel --prod
```

### **Bước 4: Cấu hình Environment Variables**

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab "Settings" > "Environment Variables"
4. Thêm các biến môi trường (giống như Railway)

### **Bước 5: Kiểm tra**

```bash
# Xem deployment
vercel ls

# Xem logs
vercel logs
```

---

## 🖥️ **Deploy trên VPS/Server**

### **Bước 1: Chuẩn bị Server**

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Cài đặt Git
sudo apt install git -y
```

### **Bước 2: Clone Repository**

```bash
# Clone repository
git clone <your-repository-url>
cd be-readingbook

# Tạo file .env
cp env.example .env
nano .env
```

### **Bước 3: Cấu hình .env**

Chỉnh sửa file `.env` với các giá trị thực tế:

```env
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=9000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.sendgrid.net
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-key
EMAIL_FROM=noreply@yourdomain.com
```

### **Bước 4: Deploy**

```bash
# Sử dụng script tự động
chmod +x deploy-production.sh
./deploy-production.sh

# Hoặc deploy thủ công
docker-compose -f docker-compose.prod.yml up --build -d
```

### **Bước 5: Kiểm tra**

```bash
# Kiểm tra containers
docker-compose -f docker-compose.prod.yml ps

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Test API
curl http://localhost:9000/api/v1/health
```

---

## ✅ **Kiểm tra sau deploy**

### **Bước 1: Health Check**

```bash
# Heroku
curl https://your-app.herokuapp.com/api/v1/health

# Railway
curl https://your-app.railway.app/api/v1/health

# Vercel
curl https://your-app.vercel.app/api/v1/health

# VPS
curl http://your-server-ip:9000/api/v1/health
```

### **Bước 2: Test Firebase Connection**

```bash
# Test với Firebase token
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     https://your-app-url/api/v1/users
```

### **Bước 3: Test Email Service**

```bash
# Test OTP endpoint
curl -X POST https://your-app-url/api/v1/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
```

### **Bước 4: Test Socket.io (nếu có)**

```javascript
// Trong browser console
const socket = io('https://your-app-url');
socket.on('connect', () => {
    console.log('Connected to server');
});
```

---

## 🔧 **Troubleshooting**

### **Lỗi thường gặp:**

#### **1. Firebase Connection Error**
```bash
# Kiểm tra environment variables
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_DATABASE_URL

# Test Firebase connection
node -e "
const admin = require('firebase-admin');
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
console.log('Firebase connected!');
"
```

#### **2. Email Service Error**
```bash
# Kiểm tra SMTP settings
echo $SMTP_HOST
echo $SMTP_USERNAME
echo $SMTP_PASSWORD
```

#### **3. Port Already in Use**
```bash
# Kiểm tra port
sudo netstat -tulpn | grep :9000

# Kill process
sudo kill -9 <PID>
```

#### **4. Docker Issues**
```bash
# Restart Docker
sudo systemctl restart docker

# Clean up
docker system prune -f
```

---

## 📞 **Support**

- **GitHub Issues**: [Create Issue](https://github.com/your-repo/issues)
- **Email**: support@readingbook.com
- **Documentation**: [API Docs](docs_api/)

---

**Made with ❤️ by Reading Book Team**
