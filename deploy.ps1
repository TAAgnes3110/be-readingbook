# Script deploy lên Fly.io cho Reading Book API (PowerShell)
# Sử dụng: .\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Bắt đầu deploy lên Fly.io..." -ForegroundColor Cyan
Write-Host ""

# Kiểm tra flyctl đã cài đặt chưa
try {
    $null = flyctl version 2>$null
    Write-Host "✅ flyctl đã được cài đặt" -ForegroundColor Green
} catch {
    Write-Host "❌ flyctl chưa được cài đặt!" -ForegroundColor Red
    Write-Host "📥 Cài đặt flyctl:" -ForegroundColor Yellow
    Write-Host "   powershell -Command `"iwr https://fly.io/install.ps1 -useb | iex`"" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Kiểm tra đã đăng nhập chưa
try {
    $null = flyctl auth whoami 2>$null
    Write-Host "✅ Đã đăng nhập Fly.io" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Chưa đăng nhập Fly.io" -ForegroundColor Yellow
    Write-Host "🔐 Đang mở trình duyệt để đăng nhập..." -ForegroundColor Yellow
    flyctl auth login
    Write-Host "✅ Đã đăng nhập" -ForegroundColor Green
}

Write-Host ""

# Hiển thị thông tin app hiện tại
Write-Host "📋 Thông tin ứng dụng:" -ForegroundColor Cyan
try {
    flyctl status 2>$null
} catch {
    Write-Host "⚠️  Chưa có app được deploy" -ForegroundColor Yellow
}
Write-Host ""

# Hỏi có muốn set secrets không
$setSecrets = Read-Host "❓ Bạn có muốn set secrets trước khi deploy? (y/n)"
if ($setSecrets -eq "y" -or $setSecrets -eq "Y") {
    Write-Host "📝 Nhập các biến môi trường (Nhấn Enter để bỏ qua):" -ForegroundColor Cyan
    Write-Host ""

    $firebaseProjectId = Read-Host "FIREBASE_PROJECT_ID"
    if ($firebaseProjectId) {
        flyctl secrets set FIREBASE_PROJECT_ID="$firebaseProjectId"
    }

    $firebaseWebApiKey = Read-Host "FIREBASE_WEB_API_KEY"
    if ($firebaseWebApiKey) {
        flyctl secrets set FIREBASE_WEB_API_KEY="$firebaseWebApiKey"
    }

    $jwtSecret = Read-Host "JWT_SECRET"
    if ($jwtSecret) {
        flyctl secrets set JWT_SECRET="$jwtSecret"
    }

    Write-Host ""
    Write-Host "✅ Secrets đã được set" -ForegroundColor Green
    Write-Host "💡 Để set thêm secrets, xem file DEPLOY.md" -ForegroundColor Yellow
    Write-Host ""
}

# Deploy
Write-Host "🚀 Đang deploy..." -ForegroundColor Cyan
flyctl deploy --remote-only

Write-Host ""
Write-Host "✅ Deploy thành công!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Ứng dụng của bạn:" -ForegroundColor Cyan
try {
    $info = flyctl info --json 2>$null | ConvertFrom-Json
    $hostname = $info.Hostname
    Write-Host "   https://$hostname/api" -ForegroundColor Yellow
} catch {
    Write-Host "   Chạy 'flyctl info' để xem URL" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "📊 Xem logs: flyctl logs" -ForegroundColor Cyan
Write-Host "🔍 Xem status: flyctl status" -ForegroundColor Cyan
Write-Host "🌍 Mở trình duyệt: flyctl open" -ForegroundColor Cyan
Write-Host ""

