# 📖 SIMPLE EPUB API - DỄ SỬ DỤNG NHẤT

## Base URL
```
http://localhost:9000/api/epub
```

---

## 📋 **1. POST - Lấy metadata EPUB**

### **Endpoint:**
```
POST /api/epub/metadata
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "metadata": {
      "title": "Harry Potter and the Philosopher's Stone",
      "creator": "J.K. Rowling",
      "publisher": "Bloomsbury Publishing",
      "language": "en",
      "description": "A magical story about a young wizard",
      "subject": "Fantasy, Magic",
      "date": "1997-06-26",
      "rights": "Copyright J.K. Rowling"
    },
    "totalChapters": 17,
    "toc": [
      {
        "id": "chapter-1",
        "title": "The Boy Who Lived",
        "href": "chapter-1.xhtml",
        "level": 1
      },
      {
        "id": "chapter-2",
        "title": "The Vanishing Glass",
        "href": "chapter-2.xhtml",
        "level": 1
      }
    ]
  }
}
```

---

## 📚 **2. POST - Lấy danh sách chương EPUB**

### **Endpoint:**
```
POST /api/epub/chapters
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "chapters": [
      {
        "id": "chapter-1",
        "title": "The Boy Who Lived",
        "href": "chapter-1.xhtml",
        "level": 1
      },
      {
        "id": "chapter-2",
        "title": "The Vanishing Glass",
        "href": "chapter-2.xhtml",
        "level": 1
      },
      {
        "id": "chapter-3",
        "title": "The Letters from No One",
        "href": "chapter-3.xhtml",
        "level": 1
      }
    ],
    "totalChapters": 17
  }
}
```

---

## 📖 **3. POST - Lấy nội dung chương EPUB**

### **Endpoint:**
```
POST /api/epub/chapter-content
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub",
  "chapter_id": "chapter-1"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "chapterId": "chapter-1",
    "title": "The Boy Who Lived",
    "content": "<html><body><h1>The Boy Who Lived</h1><p>Mr. and Mrs. Dursley of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much...</p></body></html>"
  }
}
```

---

## ✅ **4. POST - Validate EPUB URL**

### **Endpoint:**
```
POST /api/epub/validate-url
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Response:**
```json
{
  "success": true,
  "message": "Valid EPUB URL"
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "URL does not point to an EPUB file"
}
```

---

## 📄 **5. POST - Lấy nội dung chương dạng raw**

### **Endpoint:**
```
POST /api/epub/chapter-raw
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub",
  "chapter_id": "chapter-1"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "chapterId": "chapter-1",
    "title": "The Boy Who Lived",
    "rawContent": "Raw HTML content without processing..."
  }
}
```

**Lưu ý:**
- `rawContent` trả về nội dung HTML thô chưa được xử lý
- Khác với `chapter-content` endpoint, endpoint này không xử lý HTML

---

## 🖼️ **6. POST - Lấy ảnh từ EPUB**

### **Endpoint:**
```
POST /api/epub/image
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub",
  "image_id": "cover-image"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "imageId": "cover-image",
    "image": "Buffer data...",
    "mimeType": "image/jpeg",
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  }
}
```

**Lưu ý:**
- `image` chứa dữ liệu Buffer của ảnh
- `base64` chứa ảnh được encode dạng base64 để hiển thị trực tiếp
- `mimeType` cho biết định dạng ảnh (jpeg, png, gif, etc.)

---

## 📁 **7. POST - Lấy file từ EPUB**

### **Endpoint:**
```
POST /api/epub/file
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub",
  "file_id": "style.css"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "style.css",
    "content": "body { font-family: serif; margin: 20px; }",
    "mimeType": "text/css",
    "size": 45
  }
}
```

**Lưu ý:**
- Có thể lấy các file CSS, JavaScript, hoặc file khác trong EPUB
- `size` cho biết kích thước file tính bằng bytes

---

## 🖼️ **8. POST - Lấy danh sách tất cả ảnh trong EPUB**

### **Endpoint:**
```
POST /api/epub/images
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "cover-image",
        "href": "images/cover.jpg",
        "mediaType": "image/jpeg"
      },
      {
        "id": "chapter-1-image",
        "href": "images/chapter1.jpg",
        "mediaType": "image/png"
      },
      {
        "id": "illustration-1",
        "href": "images/illustration1.gif",
        "mediaType": "image/gif"
      }
    ],
    "totalImages": 3
  }
}
```

---

## ⚠️ **LƯU Ý QUAN TRỌNG:**

### **1. URL Format:**
- Tất cả endpoints yêu cầu `epub_url` phải là URL hợp lệ
- URL phải trỏ đến file EPUB (.epub extension)
- Hệ thống sẽ tự động download và xử lý file EPUB

### **2. Timeout:**
- Timeout download: 30 giây
- Timeout validation: 10 giây
- Nếu quá timeout sẽ trả về lỗi

### **3. File Management:**
- Hệ thống tự động tạo và xóa file tạm
- File tạm được lưu trong thư mục hệ thống
- Tự động cleanup file cũ (hơn 1 giờ)

### **4. Error Handling:**
- Tất cả lỗi đều trả về format JSON với `success: false`
- Message lỗi bằng tiếng Việt
- HTTP status code phù hợp với loại lỗi

### **5. Chapter ID:**
- `chapter_id` phải chính xác theo ID trong EPUB
- Sử dụng endpoint `/chapters` để lấy danh sách chapter ID
- ID thường có format như: "chapter-1", "ch01", "intro", etc.

---

## 📊 **TÓM TẮT CÁC ENDPOINT:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/epub/metadata` | Lấy metadata EPUB (title, author, etc.) |
| POST | `/api/epub/chapters` | Lấy danh sách tất cả chương |
| POST | `/api/epub/chapter-content` | Lấy nội dung chương (HTML processed) |
| POST | `/api/epub/validate-url` | Kiểm tra URL EPUB có hợp lệ |
| POST | `/api/epub/chapter-raw` | Lấy nội dung chương dạng raw |
| POST | `/api/epub/image` | Lấy ảnh cụ thể từ EPUB |
| POST | `/api/epub/file` | Lấy file (CSS, JS, etc.) từ EPUB |
| POST | `/api/epub/images` | Lấy danh sách tất cả ảnh |

---

## 🔄 **WORKFLOW SỬ DỤNG:**

### **Bước 1: Validate URL**
```bash
POST /api/epub/validate-url
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Bước 2: Lấy metadata**
```bash
POST /api/epub/metadata
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Bước 3: Lấy danh sách chương**
```bash
POST /api/epub/chapters
{
  "epub_url": "https://example.com/book.epub"
}
```

### **Bước 4: Đọc từng chương**
```bash
POST /api/epub/chapter-content
{
  "epub_url": "https://example.com/book.epub",
  "chapter_id": "chapter-1"
}
```

### **Bước 5: Lấy ảnh (nếu cần)**
```bash
POST /api/epub/images
{
  "epub_url": "https://example.com/book.epub"
}
```

---

## 🚀 **VÍ DỤ SỬ DỤNG VỚI CURL:**

### **Validate URL:**
```bash
curl -X POST http://localhost:9000/api/epub/validate-url \
  -H "Content-Type: application/json" \
  -d '{"epub_url": "https://example.com/book.epub"}'
```

### **Lấy metadata:**
```bash
curl -X POST http://localhost:9000/api/epub/metadata \
  -H "Content-Type: application/json" \
  -d '{"epub_url": "https://example.com/book.epub"}'
```

### **Lấy danh sách chương:**
```bash
curl -X POST http://localhost:9000/api/epub/chapters \
  -H "Content-Type: application/json" \
  -d '{"epub_url": "https://example.com/book.epub"}'
```

### **Lấy nội dung chương:**
```bash
curl -X POST http://localhost:9000/api/epub/chapter-content \
  -H "Content-Type: application/json" \
  -d '{"epub_url": "https://example.com/book.epub", "chapter_id": "chapter-1"}'
```
