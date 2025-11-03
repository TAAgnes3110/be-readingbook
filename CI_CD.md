# 🚀 CI/CD Pipeline - Tự động hóa Deploy

Hướng dẫn thiết lập và sử dụng CI/CD pipeline để tự động deploy lên Fly.io khi push code lên GitHub.

## 📋 Tổng quan

CI/CD pipeline này sẽ:
- ✅ Tự động chạy linter và test khi push code
- ✅ Tự động deploy lên Fly.io khi push vào branch `main`
- ✅ Sử dụng Docker layer caching để build nhanh hơn
- ✅ Bảo mật với user không phải root trong container

## 🔧 Thiết lập ban đầu (chỉ làm 1 lần)

### 1. Tạo Fly.io API Token

```bash
# Đăng nhập Fly.io
flyctl auth login

# Tạo API token
flyctl tokens create deploy -x 999999h
# Lưu lại token này (sẽ chỉ hiển thị 1 lần!)
```

### 2. Thêm Secret vào GitHub

1. Vào repository trên GitHub
2. Vào **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Thêm secret:
   - **Name**: `FLY_API_TOKEN`
   - **Value**: Token vừa tạo ở bước 1
5. Click **Add secret**

## 🔄 Workflow tự động

### Khi nào pipeline chạy?

Pipeline tự động chạy khi:
- ✅ Push code vào branch `main`
- ✅ Chạy thủ công từ GitHub Actions tab (workflow_dispatch)

Pipeline **KHÔNG** chạy khi:
- ❌ Chỉ thay đổi file `.md` (tài liệu)
- ❌ Thay đổi trong thư mục `docs_api/`

### Quy trình pipeline

```
┌─────────────┐
│ Push to main│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Checkout code  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Install deps    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│  Run Linter     │ ────▶ │  Lint Check  │
└──────┬──────────┘      └──────────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│  Run Tests      │ ────▶ │  Test Check  │
└──────┬──────────┘      └──────────────┘
       │
       ▼
┌─────────────────┐
│ Setup Fly CLI   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│ Deploy to Fly.io│ ────▶ │   Success!  │
└─────────────────┘      └──────────────┘
```

## 📝 File cấu hình

### `.github/workflows/fly-deploy.yml`

Workflow file chứa các bước:
1. **Test job**: Chạy linter và tests
2. **Deploy job**: Deploy lên Fly.io (chỉ chạy khi test pass)

### `Dockerfile`

Đã được tối ưu với:
- ✅ Layer caching (dependencies chỉ rebuild khi `package.json` thay đổi)
- ✅ Security (chạy với user không phải root)
- ✅ Health check tự động

## 🚀 Cách sử dụng

### Deploy tự động (Khuyên dùng)

1. Commit và push code:
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```

2. Pipeline tự động chạy:
   - Vào tab **Actions** trên GitHub để xem progress
   - Deploy tự động sau khi test pass

3. Kiểm tra deploy:
   ```bash
   npm run fly:status
   npm run fly:logs
   ```

### Deploy thủ công (nếu cần)

Nếu muốn deploy thủ công mà không push code:

```bash
npm run deploy
```

Hoặc từ GitHub:
1. Vào tab **Actions**
2. Chọn workflow **Deploy to Fly.io**
3. Click **Run workflow**

## ⚡ Tối ưu tốc độ

### Docker Layer Caching

Dockerfile đã được tối ưu để tận dụng layer caching:

```dockerfile
# Layer này được cache nếu package.json không đổi
COPY package*.json ./
RUN npm ci --omit=dev

# Layer này rebuild khi code thay đổi
COPY . .
```

**Lợi ích**:
- Build nhanh hơn 2-3 lần khi chỉ code thay đổi
- Tiết kiệm bandwidth và thời gian

### Tắt test nếu cần (không khuyên dùng)

Nếu muốn deploy ngay cả khi test fail, sửa file `.github/workflows/fly-deploy.yml`:

```yaml
deploy:
  needs: test
  if: always()  # Thay vì: if: github.event_name == 'push'...
```

⚠️ **Không khuyên dùng** vì có thể deploy code lỗi.

## 🔍 Troubleshooting

### Pipeline không chạy

1. Kiểm tra đã push vào branch `main` chưa
2. Kiểm tra file `.github/workflows/fly-deploy.yml` có trong repo không
3. Kiểm tra GitHub Actions đã được enable chưa (Settings → Actions)

### Lỗi "FLY_API_TOKEN not found"

1. Kiểm tra đã thêm secret `FLY_API_TOKEN` vào GitHub chưa
2. Đảm bảo secret name chính xác: `FLY_API_TOKEN` (chữ hoa)
3. Tạo token mới nếu cần:
   ```bash
   flyctl tokens create deploy -x 999999h
   ```

### Deploy fail nhưng code đúng

1. Kiểm tra logs trong GitHub Actions
2. Kiểm tra Fly.io logs:
   ```bash
   npm run fly:logs
   ```
3. Thử deploy thủ công để debug:
   ```bash
   npm run deploy
   ```

## 📊 Monitoring

### Xem pipeline status

- GitHub: Tab **Actions** → Xem workflow runs
- Email: GitHub sẽ gửi email nếu workflow fail (nếu đã bật)

### Xem application status

```bash
# Status
npm run fly:status

# Logs real-time
npm run fly:logs

# Mở trên trình duyệt
npm run fly:open
```

## 💡 Best Practices

1. **Luôn test local trước khi push**
   ```bash
   npm run lint
   npm test
   ```

2. **Commit message rõ ràng**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   ```

3. **Review code trước khi merge vào main** (nếu có team)

4. **Monitor deploy** sau mỗi lần push

5. **Backup secrets** trước khi thay đổi:
   ```bash
   npm run fly:secrets > secrets-backup.txt
   ```

## 🎯 So sánh: Manual vs CI/CD

| Tính năng | Manual Deploy | CI/CD |
|-----------|---------------|-------|
| Tốc độ | Chậm (~5-10 phút) | Nhanh (~3-5 phút) |
| Tự động test | ❌ Phải chạy thủ công | ✅ Tự động |
| Lỗi do quên | ⚠️ Có thể xảy ra | ✅ Ít hơn |
| Lịch sử | ❌ Không rõ ràng | ✅ Có trong GitHub |
| Đa môi trường | ❌ Khó | ✅ Dễ mở rộng |

---

**Sau khi setup xong, chỉ cần `git push` là tự động deploy!** 🚀

