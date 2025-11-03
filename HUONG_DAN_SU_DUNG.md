# 🚀 Hướng dẫn sử dụng CI/CD - Quick Start

## 📋 Bước 1: Thiết lập ban đầu (chỉ làm 1 lần)

### 1.1. Tạo Fly.io API Token

```bash
# Đăng nhập Fly.io (nếu chưa)
flyctl auth login

# Tạo token (lưu lại token này!)
flyctl tokens create deploy -x 999999h
```

Token sẽ hiển thị như:
```
fly_xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Lưu ý**: Token chỉ hiển thị 1 lần, copy ngay!

### 1.2. Thêm Secret vào GitHub

1. Vào repository trên GitHub
2. Click **Settings** (bên phải menu)
3. Chọn **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Điền:
   - **Name**: `FLY_API_TOKEN`
   - **Secret**: Dán token vừa tạo
6. Click **Add secret**

✅ Xong! Bây giờ có thể dùng CI/CD.

---

## 🔄 Bước 2: Sử dụng hàng ngày

### Cách 1: Tự động deploy (Khuyên dùng)

Chỉ cần commit và push code:

```bash
# Làm việc với code
# ... edit files ...

# Commit và push
git add .
git commit -m "feat: thêm tính năng mới"
git push origin main
```

**Sau khi push:**
1. Vào tab **Actions** trên GitHub
2. Xem pipeline đang chạy
3. Đợi vài phút → Deploy tự động xong!

✅ **Không cần làm gì thêm!**

### Cách 2: Deploy thủ công (nếu cần)

Nếu muốn deploy ngay mà không push code:

```bash
npm run deploy
```

Hoặc:
1. Vào tab **Actions** trên GitHub
2. Chọn workflow **Deploy to Fly.io**
3. Click **Run workflow** → **Run workflow**

---

## 📊 Xem kết quả deploy

### Trên GitHub

1. Vào tab **Actions**
2. Click vào workflow run mới nhất
3. Xem logs và status

### Trên terminal

```bash
# Xem status app
npm run fly:status

# Xem logs real-time
npm run fly:logs

# Mở trên trình duyệt
npm run fly:open

# Xem tất cả secrets
npm run fly:secrets
```

---

## 🔍 Workflow hoàn chỉnh

### Lần đầu setup:

```bash
# 1. Set secrets từ .env
npm run fly:set-secrets

# 2. Push code để trigger CI/CD
git push origin main
```

### Hàng ngày:

```bash
# Chỉ cần push code!
git add .
git commit -m "update"
git push origin main
```

---

## ⚠️ Troubleshooting nhanh

### Pipeline không chạy?

- ✅ Đảm bảo đã push vào branch `main`
- ✅ Kiểm tra có file `.github/workflows/fly-deploy.yml` không
- ✅ Xem GitHub Actions đã được enable (Settings → Actions)

### Lỗi "FLY_API_TOKEN not found"?

- ✅ Kiểm tra đã thêm secret `FLY_API_TOKEN` chưa
- ✅ Đảm bảo tên secret đúng: `FLY_API_TOKEN` (chữ hoa)
- ✅ Tạo token mới nếu cần

### Deploy fail?

```bash
# Xem logs chi tiết
npm run fly:logs

# Hoặc thử deploy thủ công để debug
npm run deploy
```

---

## 💡 Tips

1. **Luôn test local trước khi push**:
   ```bash
   npm run lint
   npm test
   ```

2. **Commit message rõ ràng**:
   ```bash
   git commit -m "feat: thêm tính năng"
   git commit -m "fix: sửa lỗi"
   git commit -m "docs: cập nhật tài liệu"
   ```

3. **Monitor sau mỗi deploy**:
   - Kiểm tra logs
   - Test API endpoints
   - Xem health check

---

## 📚 Tài liệu chi tiết

- **CI/CD chi tiết**: Xem [CI_CD.md](CI_CD.md)
- **Set secrets**: Xem [SET_SECRETS.md](SET_SECRETS.md)
- **Deploy manual**: Xem [DEPLOY.md](DEPLOY.md) (nếu có)

---

**Tóm lại: Sau khi setup, chỉ cần `git push` là tự động deploy!** 🚀

