#!/bin/bash

# ===========================================
# SCRIPT DEPLOY PRODUCTION CHO READING BOOK API
# ===========================================

set -e  # Dừng script nếu có lỗi

echo "🚀 Bắt đầu deploy Reading Book API..."

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hàm log
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Kiểm tra Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker chưa được cài đặt!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose chưa được cài đặt!"
    exit 1
fi

# Kiểm tra file .env
if [ ! -f ".env" ]; then
    log_error "File .env không tồn tại!"
    log_info "Tạo file .env từ env.example..."
    cp env.example .env
    log_warning "Vui lòng cấu hình file .env trước khi deploy!"
    exit 1
fi

# Backup dữ liệu hiện tại (nếu có)
if [ -d "uploads" ]; then
    log_info "Backup thư mục uploads..."
    tar -czf "uploads-backup-$(date +%Y%m%d-%H%M%S).tar.gz" uploads/
    log_success "Backup hoàn thành!"
fi

# Dừng containers hiện tại
log_info "Dừng containers hiện tại..."
docker-compose -f docker-compose.prod.yml down || true

# Xóa images cũ (tùy chọn)
if [ "$1" = "--clean" ]; then
    log_info "Xóa images cũ..."
    docker system prune -f
    docker volume prune -f
fi

# Build và chạy containers mới
log_info "Build và chạy containers..."
docker-compose -f docker-compose.prod.yml up --build -d

# Kiểm tra trạng thái containers
log_info "Kiểm tra trạng thái containers..."
sleep 10

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    log_success "Containers đã chạy thành công!"
else
    log_error "Có lỗi khi chạy containers!"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# Kiểm tra health check
log_info "Kiểm tra health check..."
for i in {1..30}; do
    if curl -f http://localhost:9000/api/v1/health > /dev/null 2>&1; then
        log_success "API đã sẵn sàng!"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "API không phản hồi sau 30 giây!"
        docker-compose -f docker-compose.prod.yml logs app
        exit 1
    fi
    sleep 1
done

# Hiển thị thông tin
log_success "🎉 Deploy hoàn thành!"
echo ""
echo "📊 Thông tin deployment:"
echo "  - API URL: http://localhost:9000/api/v1"
echo "  - Health Check: http://localhost:9000/api/v1/health"
echo "  - Nginx: http://localhost:80 (nếu có)"
echo ""
echo "📝 Commands hữu ích:"
echo "  - Xem logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Dừng: docker-compose -f docker-compose.prod.yml down"
echo "  - Restart: docker-compose -f docker-compose.prod.yml restart"
echo "  - Xem trạng thái: docker-compose -f docker-compose.prod.yml ps"
echo ""

# Test API
log_info "Test API endpoints..."
if curl -f http://localhost:9000/api/v1/health > /dev/null 2>&1; then
    log_success "✅ Health check: OK"
else
    log_error "❌ Health check: FAILED"
fi

log_success "🚀 Reading Book API đã sẵn sàng phục vụ!"
