# 🔑 Set Secrets từ file .env lên Fly.io

Script tự động để import tất cả biến môi trường từ file `.env` lên Fly.io.

## ⚡ Cách sử dụng nhanh

### Cách 1: Dùng npm script (Khuyên dùng)

```bash
npm run fly:set-secrets
```

### Cách 2: Dùng script trực tiếp

**Windows (PowerShell):**
```powershell
.\set-secrets.ps1
```

**Mac/Linux (Bash):**
```bash
bash set-secrets.sh
```

**Node.js (Mọi hệ điều hành):**
```bash
node set-secrets.js
```

## 📋 Cách hoạt động

1. Script đọc file `.env` trong thư mục hiện tại
2. Tự động bỏ qua:
   - Dòng comment (bắt đầu bằng `#`)
   - Dòng trống
   - Giá trị placeholder (như `your-project-id`, `your-super-secret-jwt-key-here`)
3. Set từng biến lên Fly.io
4. Hiển thị thống kê số biến đã set thành công

## ⚠️ Lưu ý quan trọng

### 1. File .env phải tồn tại

Đảm bảo bạn đã tạo file `.env` từ `env.example`:

```bash
cp env.example .env
```

### 2. Cập nhật giá trị thực tế

Trước khi chạy script, hãy đảm bảo file `.env` đã được điền đầy đủ giá trị thực tế (không phải placeholder).

Ví dụ:
```env
# ✅ ĐÚNG - Giá trị thực tế
FIREBASE_PROJECT_ID=my-real-project-12345
JWT_SECRET=my-super-secret-key-abc123

# ❌ SAI - Giá trị placeholder sẽ bị bỏ qua
FIREBASE_PROJECT_ID=your-project-id
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Private Key với nhiều dòng

Với `FIREBASE_PRIVATE_KEY` có nhiều dòng, giữ nguyên format trong `.env`:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

Script sẽ tự động xử lý.

### 4. Xác nhận trước khi set

Script sẽ hỏi xác nhận trước khi set secrets để tránh nhầm lẫn:

```
❓ Bạn có muốn set tất cả biến này lên Fly.io? (y/n):
```

## 🔍 Kiểm tra sau khi set

Sau khi chạy script, kiểm tra lại:

```bash
# Xem tất cả secrets đã set
npm run fly:secrets

# Hoặc
flyctl secrets list
```

## 📝 Ví dụ output

```
📖 Đang đọc file .env...

🔍 Tìm thấy 25 biến môi trường
📝 Có 20 biến hợp lệ để set

❓ Bạn có muốn set tất cả biến này lên Fly.io? (y/n): y

🚀 Bắt đầu set secrets...

⚙️  Đang set NODE_ENV... ✅
⚙️  Đang set APP_NAME... ✅
⚙️  Đang set FIREBASE_PROJECT_ID... ✅
⚙️  Đang set JWT_SECRET... ✅
...

✅ Hoàn thành!
📊 Thống kê:
   - Đã set: 20 biến
   - Thất bại: 0 biến

🔍 Xem tất cả secrets: flyctl secrets list
```

## 🛠️ Troubleshooting

### Lỗi: File .env không tồn tại

```bash
# Tạo file .env từ template
cp env.example .env

# Chỉnh sửa file .env với giá trị thực tế
nano .env  # hoặc code .env
```

### Lỗi: flyctl chưa được cài đặt

```bash
# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

### Lỗi: Chưa đăng nhập

Script sẽ tự động mở trình duyệt để đăng nhập. Nếu không, chạy thủ công:

```bash
flyctl auth login
```

### Một số biến bị bỏ qua

Nếu thấy thông báo "⏭️ Bỏ qua ... (chưa được cấu hình)", có nghĩa là giá trị trong `.env` vẫn là placeholder.

Cần cập nhật giá trị thực tế trước khi chạy lại script.

## 🚀 Workflow hoàn chỉnh

```bash
# 1. Setup lần đầu (chỉ làm 1 lần)
flyctl auth login

# 2. Set tất cả secrets từ .env
npm run fly:set-secrets

# 3. Deploy
npm run deploy

# 4. Kiểm tra
npm run fly:status
npm run fly:logs
```

### ⚠️ Lưu ý về Deploy

**Lỗi "We need your payment information":**
- Nếu gặp lỗi này khi deploy, đó là do lệnh `--remote-only` cố sử dụng Depot Remote Builder (cần thanh toán)
- **Giải pháp**: Script `npm run deploy` đã được cập nhật để dùng builder mặc định miễn phí của Fly.io
- Nếu vẫn gặp lỗi, thử:
  ```bash
  # Deploy với builder mặc định (miễn phí)
  npm run deploy

  # Hoặc build local rồi push
  npm run deploy:local

  # Deploy và mở trình duyệt sau khi xong
  npm run deploy:open
  ```

### 📝 Các script deploy có sẵn

- `npm run deploy` - Deploy với builder mặc định (miễn phí)
- `npm run deploy:local` - Build local rồi push lên
- `npm run deploy:remote` - Deploy với remote builder (cần thanh toán nếu dùng Depot)
- `npm run deploy:open` - Deploy và mở trình duyệt sau khi xong

## 💡 Tips

1. **Backup secrets**: Trước khi set, bạn có thể export secrets hiện tại:
   ```bash
   flyctl secrets list > secrets-backup.txt
   ```

2. **Update từng phần**: Nếu chỉ muốn update một vài biến, có thể edit file `.env`, xóa các dòng không cần update, rồi chạy script.

3. **Kiểm tra trước**: Xem secrets hiện tại để tránh ghi đè nhầm:
   ```bash
   flyctl secrets list
   ```

---

**Sau khi set secrets xong, chạy `npm run deploy` để deploy ứng dụng!** 🚀

