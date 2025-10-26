# 🚀 Hướng dẫn Deploy Reading Book API

> Hướng dẫn chi tiết deploy ứng dụng Reading Book API lên các nền tảng khác nhau

## 📋 Mục lục

- [Deploy trên VPS/Server](#deploy-trên-vpsserver)
- [Deploy trên Heroku](#deploy-trên-heroku)
- [Deploy trên Railway](#deploy-trên-railway)
- [Deploy trên Vercel](#deploy-trên-vercel)
- [Deploy trên DigitalOcean App Platform](#deploy-trên-digitalocean-app-platform)
- [Monitoring và Maintenance](#monitoring-và-maintenance)

---

## 🖥️ Deploy trên VPS/Server

### Yêu cầu hệ thống

- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Tối thiểu 1GB (khuyến nghị 2GB+)
- **Storage**: Tối thiểu 10GB
- **Network**: Port 80, 443, 9000 mở

### Bước 1: Chuẩn bị server

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

# Cài đặt Nginx (tùy chọn)
sudo apt install nginx -y
```

### Bước 2: Clone và cấu hình

```bash
# Clone repository
git clone <your-repository-url>
cd be-readingbook

# Tạo file .env
cp env.example .env
nano .env
```

### Bước 3: Cấu hình production

**File `.env` cho production:**

```env
# ===========================================
# CẤU HÌNH PRODUCTION
# ===========================================
NODE_ENV=production
APP_NAME=Reading Book API
APP_HOST=0.0.0.0
APP_PORT=9000
API_VERSION=v1
API_PREFIX=/api
LOG_LEVEL=info

# ===========================================
# FIREBASE PRODUCTION
# ===========================================
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PROJECT_NUMBER=your-production-number
FIREBASE_DATABASE_URL=https://your-production-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-production-web-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-production-project.iam.gserviceaccount.com

# ===========================================
# EMAIL PRODUCTION
# ===========================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# ===========================================
# BẢO MẬT
# ===========================================
JWT_SECRET=your-super-secret-production-jwt-key
JWT_EXPIRY=24h
RATE_LIMIT=100
RATE_LIMIT_WINDOW=15
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Bước 4: Deploy

```bash
# Sử dụng script tự động
./deploy-production.sh

# Hoặc deploy thủ công
docker-compose -f docker-compose.prod.yml up --build -d

# Kiểm tra trạng thái
docker-compose -f docker-compose.prod.yml ps
```

### Bước 5: Cấu hình Nginx + SSL

```bash
# Cài đặt Certbot
sudo apt install certbot python3-certbot-nginx -y

# Tạo SSL certificate
sudo certbot --nginx -d your-domain.com

# Tự động gia hạn
sudo crontab -e
# Thêm: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🟣 Deploy trên Heroku

### Bước 1: Chuẩn bị

```bash
# Cài đặt Heroku CLI
# Tải từ: https://devcenter.heroku.com/articles/heroku-cli

# Đăng nhập
heroku login
```

### Bước 2: Cấu hình dự án

```bash
# Tạo app
heroku create your-app-name

# Cấu hình environment variables
heroku config:set NODE_ENV=production
heroku config:set APP_HOST=0.0.0.0
heroku config:set APP_PORT=$PORT
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_WEB_API_KEY=your-web-api-key
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set SMTP_HOST=smtp.sendgrid.net
heroku config:set SMTP_USERNAME=apikey
heroku config:set SMTP_PASSWORD=your-sendgrid-key
```

### Bước 3: Deploy

```bash
# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Mở app
heroku open

# Xem logs
heroku logs --tail
```

---

## 🚂 Deploy trên Railway

### Bước 1: Chuẩn bị

```bash
# Cài đặt Railway CLI
npm install -g @railway/cli

# Đăng nhập
railway login
```

### Bước 2: Deploy

```bash
# Khởi tạo project
railway init

# Deploy
railway up

# Cấu hình environment variables trong Railway dashboard
```

### Bước 3: Cấu hình Environment Variables

Trong Railway dashboard, thêm các biến môi trường:

```
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=$PORT
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_WEB_API_KEY=your-web-api-key
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.sendgrid.net
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-key
```

---

## ▲ Deploy trên Vercel

### Bước 1: Chuẩn bị

```bash
# Cài đặt Vercel CLI
npm install -g vercel
```

### Bước 2: Cấu hình

File `vercel.json` đã được tạo sẵn với nội dung:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Bước 3: Deploy

```bash
# Deploy
vercel

# Deploy production
vercel --prod

# Cấu hình environment variables trong Vercel dashboard
```

---

## 🐳 Deploy trên DigitalOcean App Platform

### Bước 1: Chuẩn bị

1. Tạo tài khoản DigitalOcean
2. Tạo App Platform project
3. Connect với GitHub repository

### Bước 2: Cấu hình

**App Spec (app.yaml):**

```yaml
name: reading-book-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/be-readingbook
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: APP_HOST
    value: 0.0.0.0
  - key: APP_PORT
    value: "8080"
  - key: FIREBASE_PROJECT_ID
    value: your-project-id
  - key: FIREBASE_WEB_API_KEY
    value: your-web-api-key
  - key: JWT_SECRET
    value: your-jwt-secret
  - key: SMTP_HOST
    value: smtp.sendgrid.net
  - key: SMTP_USERNAME
    value: apikey
  - key: SMTP_PASSWORD
    value: your-sendgrid-key
  health_check:
    http_path: /api/v1/health
```

---

## 📊 Monitoring và Maintenance

### Health Check

```bash
# Kiểm tra API
curl http://your-domain.com/api/v1/health

# Kiểm tra Docker containers
docker-compose -f docker-compose.prod.yml ps

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Backup

```bash
# Backup uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Backup database (nếu sử dụng MySQL/PostgreSQL)
mysqldump -u username -p database_name > backup.sql
```

### Update

```bash
# Update code
git pull origin main

# Rebuild và restart
docker-compose -f docker-compose.prod.yml up --build -d

# Hoặc sử dụng script
./deploy-production.sh
```

### Monitoring Commands

```bash
# Xem resource usage
docker stats

# Xem logs real-time
docker-compose -f docker-compose.prod.yml logs -f app

# Restart service
docker-compose -f docker-compose.prod.yml restart app

# Scale service
docker-compose -f docker-compose.prod.yml up --scale app=3 -d
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port đã được sử dụng
```bash
# Kiểm tra port
sudo netstat -tulpn | grep :9000

# Kill process
sudo kill -9 <PID>
```

#### 2. Docker không chạy
```bash
# Restart Docker
sudo systemctl restart docker

# Kiểm tra Docker daemon
sudo systemctl status docker
```

#### 3. Environment variables không load
```bash
# Kiểm tra file .env
cat .env

# Test environment
docker-compose -f docker-compose.prod.yml exec app env
```

#### 4. SSL certificate lỗi
```bash
# Renew certificate
sudo certbot renew

# Test certificate
sudo certbot certificates
```

---

## 📞 Support

- **GitHub Issues**: [Create Issue](https://github.com/your-repo/issues)
- **Documentation**: [API Docs](docs_api/)
- **Email**: support@readingbook.com

---

**Made with ❤️ by Reading Book Team**
