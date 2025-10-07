# 🐳 Hướng dẫn sử dụng Docker cho Reading Book API

## 📋 Yêu cầu hệ thống

- Docker Engine 20.10+
- Docker Compose 2.0+
- ít nhất 2GB RAM
- ít nhất 1GB dung lượng ổ cứng

## 🚀 Cài đặt và chạy ứng dụng

### 1. Chuẩn bị môi trường

```bash
# Clone repository
git clone <repository-url>
cd be-readingbook

# File .env đã có sẵn từ env.example
# Chỉnh sửa file .env với các thông tin thực tế
nano .env

# Hoặc sử dụng file Docker-specific
cp env.docker.example .env
```

### 2. Chạy ứng dụng với Docker

#### Development Mode (với hot reload)

```bash
# Chạy ứng dụng development
npm run docker:dev

# Hoặc sử dụng docker-compose trực tiếp
docker-compose -f docker-compose.dev.yml up --build
```

#### Production Mode

```bash
# Chạy ứng dụng production
npm run docker:prod

# Hoặc sử dụng docker-compose trực tiếp
docker-compose up --build -d
```

### 3. Các lệnh Docker hữu ích

```bash
# Xem logs
npm run docker:logs

# Dừng ứng dụng
npm run docker:down

# Build lại image
npm run docker:build

# Chạy container đơn lẻ
npm run docker:run

# Dọn dẹp Docker (xóa images, containers không dùng)
npm run docker:clean
```

## 🔧 Cấu hình Docker

### Dockerfile

- **Base Image**: Node.js 18 Alpine (nhẹ và bảo mật)
- **Multi-stage build**: Tối ưu kích thước image
- **Non-root user**: Chạy với user `nodejs` để bảo mật
- **Health check**: Kiểm tra sức khỏe ứng dụng

### Docker Compose

#### Production (`docker-compose.yml`)
- **App service**: Ứng dụng chính
- **Redis service**: Cache và session storage
- **Nginx service**: Reverse proxy và load balancer

#### Development (`docker-compose.dev.yml`)
- **App service**: Với hot reload
- **Redis service**: Cache cho development

## 📁 Cấu trúc thư mục

```
be-readingbook/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── .dockerignore           # Files to ignore in Docker build
├── nginx.conf              # Nginx configuration
├── env.example             # Environment variables template
├── env.docker.example      # Docker-specific environment template
└── DOCKER_GUIDE.md         # Hướng dẫn này
```

## 🌐 Truy cập ứng dụng

- **API**: http://localhost:9000/api/v1
- **Health Check**: http://localhost:9000/api/v1/health
- **Nginx Proxy**: http://localhost:80 (nếu sử dụng nginx)

## 🔒 Bảo mật

### Environment Variables
- Tất cả thông tin nhạy cảm được lưu trong file `.env`
- File `.env` không được commit vào Git
- Sử dụng Docker secrets cho production

### Container Security
- Chạy với non-root user
- Sử dụng Alpine Linux (ít attack surface)
- Regular security updates

## 🐛 Troubleshooting

### Container không start được

```bash
# Kiểm tra logs
docker-compose logs app

# Kiểm tra status containers
docker-compose ps

# Restart service
docker-compose restart app
```

### Port đã được sử dụng

```bash
# Kiểm tra port đang sử dụng
netstat -tulpn | grep :9000

# Thay đổi port trong docker-compose.yml
ports:
  - "9001:9000"  # Thay 9000 thành 9001
```

### Out of memory

```bash
# Tăng memory limit cho Docker
# Trong Docker Desktop: Settings > Resources > Memory

# Hoặc giảm số lượng services
docker-compose up app redis  # Chỉ chạy app và redis
```

### File permissions

```bash
# Fix permissions cho uploads folder
sudo chown -R 1001:1001 uploads/

# Hoặc rebuild container
docker-compose down
docker-compose up --build
```

## 📊 Monitoring

### Health Checks

```bash
# Kiểm tra health của container
docker-compose ps

# Xem health check logs
docker inspect reading-book-api | grep -A 10 Health
```

### Resource Usage

```bash
# Xem resource usage
docker stats

# Xem chi tiết container
docker inspect reading-book-api
```

## 🚀 Deployment

### Production Deployment

1. **Chuẩn bị server**:
   ```bash
   # Cài đặt Docker và Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Deploy ứng dụng**:
   ```bash
   # Clone code
   git clone <repository-url>
   cd be-readingbook
   
   # Cấu hình environment
   cp env.docker.example .env
   nano .env
   
   # Deploy
   docker-compose up -d
   ```

3. **Cấu hình reverse proxy** (Nginx/Apache):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:9000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### CI/CD với GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          docker-compose down
          docker-compose up -d --build
```

## 📝 Notes

- Luôn backup dữ liệu trước khi deploy
- Sử dụng Docker volumes để persist data
- Monitor logs thường xuyên
- Cập nhật base images định kỳ
- Sử dụng Docker secrets cho production

## 🆘 Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `docker-compose logs`
2. Kiểm tra documentation
3. Tạo issue trên GitHub
4. Liên hệ team development
