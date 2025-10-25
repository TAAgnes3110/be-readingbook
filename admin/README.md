# Admin Module

Thư mục này chứa toàn bộ logic dành riêng cho admin, được tách biệt hoàn toàn khỏi logic user thường.

## 🏗️ Cấu trúc

```
admin/
├── controllers/              # Admin Controllers
│   ├── index.js
│   ├── adminBookController.js
│   ├── adminCategoriesController.js
│   └── adminUserController.js
├── services/                 # Admin Services  
│   ├── index.js
│   ├── adminBookService.js
│   ├── adminCategoriesService.js
│   └── adminUserService.js
├── validations/              # Admin Validations
│   ├── index.js
│   ├── adminBookValidation.js
│   ├── adminCategoriesValidation.js
│   └── adminUserValidation.js
├── routes/                   # Admin Routes
│   ├── index.js
│   ├── adminBookRoute.js
│   ├── adminCategoriesRoute.js
│   └── adminUserRoute.js
├── middlewares/              # Admin Middlewares
│   ├── index.js
│   └── adminAuditMiddleware.js
└── README.md
```

## 🎯 Tính năng Admin

### **Books Management** (`/api/admin/books`)
- `POST /` - Tạo sách mới
- `PUT /:id` - Cập nhật sách
- `DELETE /:id` - Xóa mềm sách
- `DELETE /:id/hard` - Xóa vĩnh viễn sách
- `POST /:id/restore` - Khôi phục sách đã xóa
- `GET /deleted` - Lấy danh sách sách đã xóa

### **Categories Management** (`/api/admin/categories`)
- `POST /` - Tạo category mới
- `PUT /:categoryId` - Cập nhật category
- `DELETE /:categoryId` - Xóa mềm category
- `DELETE /:categoryId/hard` - Xóa vĩnh viễn category
- `POST /:categoryId/restore` - Khôi phục category đã xóa
- `GET /deleted` - Lấy danh sách categories đã xóa

### **Users Management** (`/api/admin/users`)
- `POST /` - Tạo user mới
- `DELETE /:userId` - Xóa mềm user
- `DELETE /:userId/hard` - Xóa vĩnh viễn user
- `POST /:userId/restore` - Khôi phục user đã xóa
- `GET /deleted` - Lấy danh sách users đã xóa
- `GET /stats` - Lấy thống kê users

## 🔐 Phân quyền & Bảo mật

### **Authentication & Authorization**
- Tất cả routes yêu cầu đăng nhập
- Chỉ user có role `admin` mới được truy cập
- Middleware `authorize` kiểm tra quyền cụ thể

### **Audit Trail**
- Ghi log tất cả thao tác admin
- Theo dõi IP, User-Agent, timestamp
- Audit data được lưu trong request

### **Rate Limiting**
- Giới hạn số request admin (100 requests/15 phút)
- Tránh abuse và spam

## 🛠️ Soft Delete Strategy

### **Soft Delete (Xóa mềm)**
- Đánh dấu `isActive = false` thay vì xóa hẳn
- Có thể khôi phục sau này
- Bảo toàn dữ liệu quan trọng

### **Hard Delete (Xóa vĩnh viễn)**
- Xóa hoàn toàn khỏi database
- Không thể khôi phục
- Chỉ dành cho admin cao cấp

## 📊 Admin Features

### **Thống kê & Báo cáo**
- Thống kê users, books, categories
- Theo dõi hoạt động hệ thống
- Báo cáo hiệu suất

### **Quản lý dữ liệu**
- Khôi phục dữ liệu đã xóa
- Xóa vĩnh viễn dữ liệu không cần thiết
- Quản lý trạng thái entities

## 🔄 Logic nghiệp vụ

- **Controllers**: Xử lý HTTP requests/responses
- **Services**: Logic nghiệp vụ admin (extend từ src/services)
- **Validations**: Validation rules riêng cho admin
- **Models**: Sử dụng chung từ `src/models`

## 🚀 Lợi ích

1. **Tách biệt rõ ràng**: Admin logic không ảnh hưởng user logic
2. **Dễ bảo trì**: Tìm kiếm và sửa đổi nhanh chóng
3. **Bảo mật cao**: Kiểm soát quyền truy cập chặt chẽ
4. **Mở rộng dễ dàng**: Thêm tính năng admin không ảnh hưởng user
5. **Audit đầy đủ**: Theo dõi mọi thao tác admin
