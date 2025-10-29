# 🚀 HƯỚNG DẪN DEPLOY LÊN RENDER.COM

Dự án này được cấu hình để deploy lên **Render.com** - nền tảng miễn phí, không cần credit card.

---

## 📋 YÊU CẦU TRƯỚC KHI DEPLOY

### 1. ✅ Tài khoản GitHub
- Code đã được push lên GitHub repository

### 2. ✅ Tài khoản Render (Miễn phí)
- Đăng ký tại: https://render.com/
- Không cần credit card

### 3. ✅ Resend API Key (Miễn phí - Bắt buộc)
- **Tại sao cần:** Render Free tier chặn SMTP port (587, 465)
- **Giải pháp:** Dùng Resend API để gửi email
- **Đăng ký:** https://resend.com/signup
- **Free tier:** 100 emails/ngày, 3,000 emails/tháng

### 4. ✅ Firebase Project
- Đã tạo Firebase project
- Có các credentials: Project ID, Database URL, Web API Key, Private Key...

---

## 🎯 BƯỚC 1: LẤY RESEND API KEY

### 1.1. Đăng ký Resend (Miễn phí)

1. Truy cập: **https://resend.com/signup**
2. Đăng ký với email của bạn
3. Verify email

### 1.2. Lấy API Key

1. Sau khi đăng nhập, vào: **https://resend.com/api-keys**
2. Click nút **"Create API Key"**
3. Đặt tên: `Reading Book API` (hoặc tên bất kỳ)
4. Chọn permission: **"Full access"** (hoặc chỉ "Sending access")
5. Click **"Create"**
6. **Copy API Key** (dạng: `re_xxxxxxxxxxxx`)

   ⚠️ **LƯU Ý:** API key chỉ hiển thị 1 lần, hãy lưu lại ngay!

### 1.3. Email gửi đi

- Mặc định: `onboarding@resend.dev` (miễn phí)
- Custom domain: Verify domain riêng nếu muốn (không bắt buộc)

---

## 🚀 BƯỚC 2: DEPLOY LÊN RENDER

### Cách 1: Deploy qua Dashboard (Đề xuất - Dễ nhất)

#### 2.1. Tạo Web Service

1. Đăng nhập vào **https://render.com/dashboard**
2. Click nút **"New +"** → Chọn **"Web Service"**
3. Connect GitHub:
   - Click **"Connect GitHub"** (lần đầu)
   - Cho phép Render truy cập repositories
   - Chọn repository **`be-readingbook`**
4. Click **"Connect"**

#### 2.2. Cấu hình Service

Điền thông tin sau:

| Trường | Giá trị |
|--------|---------|
| **Name** | `reading-book-api` (hoặc tên bạn muốn) |
| **Region** | `Singapore` (gần Việt Nam nhất) |
| **Branch** | `main` (hoặc branch bạn dùng) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

#### 2.3. Thêm Environment Variables

Scroll xuống phần **"Environment Variables"**, click **"Add Environment Variable"** và thêm từng biến sau:

**📧 Email Configuration (BẮT BUỘC):**
```
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
```

**🔐 Node Environment:**
```
NODE_ENV=production
```

**🔑 JWT Configuration (BẮT BUỘC):**
```
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_EXPIRY=24h
```

**🔥 Firebase Configuration (BẮT BUỘC):**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_NUMBER=your-project-number
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
```

⚠️ **Lưu ý về FIREBASE_PRIVATE_KEY:** Giữ nguyên dấu ngoặc kép và `\n`

**🌐 CORS Configuration:**
```
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE,PATCH
CORS_CREDENTIALS=true
```

**⚙️ App Configuration (Tùy chọn):**
```
APP_NAME=Reading Book API
APP_HOST=0.0.0.0
API_VERSION=v1
RATE_LIMIT=100
RATE_LIMIT_WINDOW=15
OTP_LENGTH=6
OTP_EXPIRY=300
OTP_PROVIDER=email
CACHE_TTL=300
CACHE_CHECKPERIOD=120
```

#### 2.4. Deploy

1. Click nút **"Create Web Service"** ở cuối trang
2. Render sẽ bắt đầu build và deploy
3. Đợi 3-5 phút để hoàn tất

---

### Cách 2: Deploy qua render.yaml (Auto)

File `render.yaml` đã được tạo sẵn trong dự án.

#### 2.1. Tạo Blueprint

1. Trên Render Dashboard, click **"New +"** → **"Blueprint"**
2. Connect repository
3. Render sẽ tự động đọc file `render.yaml`
4. Click **"Apply"**

#### 2.2. Thêm Environment Variables

Sau khi apply, vào service settings và thêm các **secret values**:
- `RESEND_API_KEY`
- `JWT_SECRET`
- `FIREBASE_PRIVATE_KEY`
- Các Firebase credentials khác

---

## ✅ BƯỚC 3: KIỂM TRA DEPLOYMENT

### 3.1. Xem Build Logs

- Trong service dashboard, vào tab **"Logs"**
- Xem quá trình build và deploy
- Đảm bảo không có lỗi

### 3.2. Kiểm tra Health Check

Sau khi deploy thành công, URL sẽ có dạng:
```
https://reading-book-api.onrender.com
```

Test health endpoint:
```bash
curl https://reading-book-api.onrender.com/health
```

Phản hồi thành công:
```json
{
  "success": true,
  "message": "Server is running normally",
  "timestamp": "2025-10-29T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 3.3. Test API Register (Kiểm tra Email)

```bash
curl -X POST https://reading-book-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "name": "Test User"
  }'
```

Nếu thành công, email OTP sẽ được gửi qua Resend API.

---

## 📊 THÔNG TIN VỀ RENDER FREE TIER

### ✅ Ưu điểm:
- Hoàn toàn miễn phí
- Không cần credit card
- Auto deploy từ GitHub
- SSL certificate miễn phí
- Custom domain (nếu có)
- 750 giờ runtime/tháng

### ⚠️ Giới hạn:
- **Server sleep:** Sau 15 phút không hoạt động, server sẽ sleep
- **Cold start:** Khởi động lại mất ~30-60 giây khi có request đầu tiên
- **Build time:** Tối đa 15 phút
- **Memory:** 512MB RAM
- **Không hỗ trợ SMTP:** Phải dùng email API (Resend, SendGrid...)

### 💡 Giải pháp cho Sleep Issue:

**Option 1: Uptime Monitoring (Miễn phí)**
1. Đăng ký: https://cron-job.org/
2. Tạo cron job ping endpoint `/health` mỗi 10 phút
3. Server sẽ không bao giờ sleep

**Option 2: Upgrade lên Paid Plan**
- **Starter Plan:** $7/tháng
- Không sleep
- Nhiều RAM và CPU hơn

---

## 🔧 CẬP NHẬT VÀ BẢO TRÌ

### Auto Deploy

Render tự động deploy khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render sẽ tự động build và deploy lại.

### Xem Logs

1. Vào Render Dashboard
2. Chọn service của bạn
3. Tab **"Logs"** để xem real-time logs
4. Tab **"Events"** để xem lịch sử deploy

### Thay đổi Environment Variables

1. Vào service settings
2. Tab **"Environment"**
3. Update/Add/Delete variables
4. Service sẽ tự động restart

---

## 🐛 TROUBLESHOOTING

### ❌ Lỗi: Email không gửi được

**Nguyên nhân:** Chưa set `RESEND_API_KEY` hoặc API key sai

**Giải pháp:**
1. Kiểm tra `RESEND_API_KEY` trong Environment Variables
2. Đảm bảo API key đúng (dạng `re_xxxxxxxxxxxx`)
3. Xem logs: `logger.info('📧 Using Resend API for email delivery')`

### ❌ Lỗi: Build failed

**Kiểm tra:**
1. `package.json` có đúng scripts không:
   ```json
   "scripts": {
     "start": "node src/index.js"
   }
   ```
2. Node version trong `package.json`:
   ```json
   "engines": {
     "node": ">=18.x"
   }
   ```
3. Xem build logs để biết lỗi cụ thể

### ❌ Lỗi: Firebase connection failed

**Kiểm tra:**
1. Tất cả biến Firebase đã set đúng chưa
2. `FIREBASE_PRIVATE_KEY` phải có dấu ngoặc kép và giữ nguyên `\n`
3. Test bằng cách gọi API cần Firebase

### ❌ Lỗi: CORS error

**Giải pháp:**
```env
# Cho phép tất cả (development)
CORS_ORIGIN=*

# Hoặc chỉ định domain cụ thể (production)
CORS_ORIGIN=https://your-frontend-domain.com
```

### ⏰ Server bị sleep quá lâu

**Giải pháp:**
1. Setup uptime monitoring (cron-job.org)
2. Hoặc upgrade lên Paid plan ($7/tháng)

---

## 📱 CONNECT VỚI FRONTEND

Sau khi deploy thành công, cập nhật URL API trong frontend:

```javascript
// Frontend config
const API_BASE_URL = 'https://reading-book-api.onrender.com/api'
```

Hoặc thêm environment variable:
```env
VITE_API_URL=https://reading-book-api.onrender.com/api
REACT_APP_API_URL=https://reading-book-api.onrender.com/api
```

---

## 🎯 CHECKLIST SAU KHI DEPLOY

- [ ] Health check hoạt động: `/health`
- [ ] API register hoạt động và gửi được email OTP
- [ ] Firebase kết nối thành công
- [ ] CORS đã cấu hình đúng
- [ ] Frontend kết nối được với API
- [ ] Logs không có lỗi nghiêm trọng
- [ ] Setup uptime monitoring (nếu cần)

---

## 📚 TÀI LIỆU THAM KHẢO

- **Render Docs:** https://render.com/docs
- **Resend Docs:** https://resend.com/docs
- **Resend API Keys:** https://resend.com/api-keys
- **Uptime Monitoring:** https://cron-job.org/

---

## 💡 TIPS & TRICKS

### 1. Custom Domain (Nếu có)

1. Vào service settings → **"Custom Domain"**
2. Add domain: `api.yourdomain.com`
3. Cấu hình DNS theo hướng dẫn của Render
4. SSL certificate tự động

### 2. Environment Groups (Cho nhiều services)

1. Tạo Environment Group với shared variables
2. Link group với services
3. Update variables 1 lần, apply cho tất cả services

### 3. Monitoring

Render cung cấp basic metrics:
- CPU usage
- Memory usage
- Response times
- Error rates

Xem tại tab **"Metrics"** trong service dashboard.

---

## ✨ HOÀN TẤT!

Chúc mừng! Bạn đã deploy thành công Reading Book API lên Render! 🎉

**URL API của bạn:**
```
https://reading-book-api.onrender.com
```

**Next steps:**
1. ✅ Test toàn bộ API endpoints
2. ✅ Connect với frontend
3. ✅ Setup uptime monitoring
4. ✅ Monitor logs thường xuyên
5. ✅ Backup environment variables

Có vấn đề gì, check logs hoặc liên hệ support! 🚀
