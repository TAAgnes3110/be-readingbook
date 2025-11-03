#!/bin/bash

# Script deploy lên Fly.io cho Reading Book API
# Sử dụng: bash deploy.sh

set -e  # Dừng nếu có lỗi

echo "🚀 Bắt đầu deploy lên Fly.io..."
echo ""

# Kiểm tra flyctl đã cài đặt chưa
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl chưa được cài đặt!"
    echo "📥 Cài đặt flyctl:"
    echo "   Windows: powershell -Command \"iwr https://fly.io/install.ps1 -useb | iex\""
    echo "   Mac/Linux: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

echo "✅ flyctl đã được cài đặt"
echo ""

# Kiểm tra đã đăng nhập chưa
if ! flyctl auth whoami &> /dev/null; then
    echo "⚠️  Chưa đăng nhập Fly.io"
    echo "🔐 Đang mở trình duyệt để đăng nhập..."
    flyctl auth login
fi

echo "✅ Đã đăng nhập Fly.io"
echo ""

# Hiển thị thông tin app hiện tại
echo "📋 Thông tin ứng dụng:"
flyctl status 2>/dev/null || echo "⚠️  Chưa có app được deploy"
echo ""

# Hỏi có muốn set secrets không
read -p "❓ Bạn có muốn set secrets trước khi deploy? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Nhập các biến môi trường (Nhấn Enter để bỏ qua):"
    echo ""

    read -p "FIREBASE_PROJECT_ID: " FIREBASE_PROJECT_ID
    [ ! -z "$FIREBASE_PROJECT_ID" ] && flyctl secrets set FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID"

    read -p "FIREBASE_WEB_API_KEY: " FIREBASE_WEB_API_KEY
    [ ! -z "$FIREBASE_WEB_API_KEY" ] && flyctl secrets set FIREBASE_WEB_API_KEY="$FIREBASE_WEB_API_KEY"

    read -p "JWT_SECRET: " JWT_SECRET
    [ ! -z "$JWT_SECRET" ] && flyctl secrets set JWT_SECRET="$JWT_SECRET"

    echo ""
    echo "✅ Secrets đã được set"
    echo "💡 Để set thêm secrets, xem file DEPLOY.md"
    echo ""
fi

# Deploy
echo "🚀 Đang deploy..."
flyctl deploy --remote-only

echo ""
echo "✅ Deploy thành công!"
echo ""
echo "🌐 Ứng dụng của bạn:"
flyctl info --json 2>/dev/null | grep -o '"hostname":"[^"]*"' | head -1 | cut -d'"' -f4 | xargs -I {} echo "   https://{}/api"
echo ""
echo "📊 Xem logs: flyctl logs"
echo "🔍 Xem status: flyctl status"
echo "🌍 Mở trình duyệt: flyctl open"
echo ""

