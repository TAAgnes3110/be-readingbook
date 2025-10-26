# 🚀 Deploy Đơn Giản - Không Cần Nginx

> Hướng dẫn deploy Reading Book API với Firebase Realtime Database mà không cần Nginx

## 🎯 **Phương pháp deploy đơn giản nhất:**

### **1. Deploy trên VPS/Server (Không Nginx)**

```bash
# Clone repository
git clone <your-repo>
cd be-readingbook

# Cấu hình .env
cp env.example .env
nano .env

# Deploy trực tiếp
docker-compose -f docker-compose.prod.yml up --build -d

# Kiểm tra
curl http://localhost:9000/api/v1/health
```

**Cấu hình .env cho production:**
```env
NODE_ENV=production
APP_HOST=0.0.0.0
APP_PORT=9000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.sendgrid.net
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-key
```

### **2. Deploy trên Heroku (Khuyến nghị)**

```bash
# Cài đặt Heroku CLI
heroku login

# Tạo app
heroku create your-app-name

# Cấu hình environment variables
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
heroku config:set FIREBASE_WEB_API_KEY=your-web-api-key
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
heroku config:set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set SMTP_HOST=smtp.sendgrid.net
heroku config:set SMTP_USERNAME=apikey
heroku config:set SMTP_PASSWORD=your-sendgrid-key

# Deploy
git push heroku main
```

### **3. Deploy trên Railway**

```bash
# Cài đặt Railway CLI
npm install -g @railway/cli
railway login

# Deploy
railway init
railway up

# Cấu hình environment variables trong Railway dashboard
```

### **4. Deploy trên Vercel**

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Deploy
vercel

# Cấu hình environment variables trong Vercel dashboard
```

## 🔥 **Firebase Realtime Database Setup**

### **1. Tạo Firebase Project**

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Bật **Realtime Database** (không phải Firestore)
4. Bật **Authentication** > Email/Password

### **2. Cấu hình Service Account**

1. Project Settings > Service Accounts
2. Generate new private key
3. Download JSON file
4. Copy các giá trị vào .env:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### **3. Cấu hình Database Rules**

Trong Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## 🚀 **Deploy Commands**

### **VPS/Server:**
```bash
# Deploy
./deploy-production.sh

# Hoặc manual
docker-compose -f docker-compose.prod.yml up --build -d

# Kiểm tra
curl http://your-server-ip:9000/api/v1/health
```

### **Heroku:**
```bash
git push heroku main
heroku open
```

### **Railway:**
```bash
railway up
```

### **Vercel:**
```bash
vercel --prod
```

## 📊 **Kiểm tra sau khi deploy**

```bash
# Health check
curl https://your-app.herokuapp.com/api/v1/health

# Test Firebase connection
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     https://your-app.herokuapp.com/api/v1/users

# Test Socket.io (nếu có)
# Mở browser console và test WebSocket connection
```

## 🔧 **Troubleshooting**

### **Firebase Connection Issues:**
```bash
# Kiểm tra environment variables
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_DATABASE_URL

# Test Firebase connection
node -e "
const admin = require('firebase-admin');
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
console.log('Firebase connected successfully!');
"
```

### **Socket.io Issues:**
```bash
# Kiểm tra CORS settings
# Đảm bảo CORS_ORIGIN được cấu hình đúng
```

## ✅ **Kết luận**

**KHÔNG CẦN NGINX** cho trường hợp của bạn vì:

1. ✅ Firebase Realtime Database hoạt động trực tiếp
2. ✅ Socket.io không cần reverse proxy
3. ✅ Cloud platforms đã có load balancer
4. ✅ SSL được handle bởi platform

**Chọn phương pháp deploy:**
- **Đơn giản nhất**: Heroku
- **Rẻ nhất**: VPS + Docker (không Nginx)
- **Nhanh nhất**: Railway
- **Miễn phí**: Vercel

---

**Made with ❤️ by Reading Book Team**
