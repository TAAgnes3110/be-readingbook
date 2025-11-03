# ⚡ Deploy Nhanh lên Fly.io

## 🚀 Lệnh deploy đơn giản nhất

Sau khi đã setup xong, chỉ cần chạy:

```bash
npm run deploy
```

Hoặc:

```bash
flyctl deploy --remote-only
```

## 📋 Setup lần đầu (Chỉ làm 1 lần)

### 1. Cài đặt Fly CLI

**Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Đăng nhập

```bash
flyctl auth login
```

### 3. Set Secrets (Biến môi trường)

**Cách nhanh nhất - Tự động từ file .env:**

```bash
npm run fly:set-secrets
```

Script này sẽ tự động đọc file `.env` và set tất cả biến môi trường lên Fly.io.

**Cách thủ công (nếu muốn set từng biến):**

```bash
# Firebase (BẮT BUỘC)
flyctl secrets set FIREBASE_PROJECT_ID=your-project-id
flyctl secrets set FIREBASE_WEB_API_KEY=your-web-api-key
flyctl secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
flyctl secrets set FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# JWT (BẮT BUỘC)
flyctl secrets set JWT_SECRET=your-super-secret-key

# Email SMTP (BẮT BUỘC)
flyctl secrets set SMTP_USERNAME=your@gmail.com
flyctl secrets set SMTP_PASSWORD=your-app-password
flyctl secrets set EMAIL_FROM=your@gmail.com
```

**Lưu ý:** Trước khi chạy `npm run fly:set-secrets`, đảm bảo file `.env` đã được điền đầy đủ giá trị thực tế (không phải placeholder).

📖 Xem hướng dẫn chi tiết trong file `SET_SECRETS.md`.

## 📝 Các lệnh thường dùng

| Lệnh | Mô tả |
|------|-------|
| `npm run deploy` | Deploy lên Fly.io |
| `npm run fly:set-secrets` | Set tất cả secrets từ .env |
| `npm run fly:status` | Xem trạng thái app |
| `npm run fly:logs` | Xem logs real-time |
| `npm run fly:open` | Mở app trên trình duyệt |
| `npm run fly:secrets` | Xem danh sách secrets |

## 🔍 Kiểm tra sau khi deploy

```bash
# Xem logs
npm run fly:logs

# Xem status
npm run fly:status

# Mở trình duyệt
npm run fly:open

# Test API
curl https://readingbook-api-cold-hill-3738.fly.dev/api/health
```

## 🌐 URL ứng dụng

Sau khi deploy thành công:

- **API Base URL**: `https://readingbook-api-cold-hill-3738.fly.dev/api`
- **Health Check**: `https://readingbook-api-cold-hill-3738.fly.dev/health`

---

📖 Xem hướng dẫn chi tiết trong file `DEPLOY.md`

