# Environment Variables cho Railway
# Copy các biến này vào Railway Dashboard > Variables

# ===========================================
# CẤU HÌNH ỨNG DỤNG
# ===========================================
NODE_ENV=production
APP_NAME=ReadingBook
APP_HOST=0.0.0.0
APP_PORT=9000
API_VERSION=v1
API_PREFIX=/api

# ===========================================
# CẤU HÌNH FIREBASE
# ===========================================
FIREBASE_PROJECT_ID=project1-700e6
FIREBASE_PROJECT_NUMBER=518796344720
FIREBASE_DATABASE_URL=https://project1-700e6-default-rtdb.asia-southeast1.firebasedatabase.app/
FIREBASE_WEB_API_KEY=AIzaSyCdrWHSk9D4eenT8PZdTwT2MnxTLvtCjXw

# ===========================================
# FIREBASE SERVICE ACCOUNT (QUAN TRỌNG!)
# ===========================================
# Lưu ý: FIREBASE_PRIVATE_KEY cần được format đúng trong Railway
# Thay thế \n bằng xuống dòng thực tế
FIREBASE_PRIVATE_KEY_ID=e779d7bf57c730b5097604d0347c6c2e1d94ed2a
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHcMVV8g/EGaAa
5Eq7MZreyqOkpS/KMi8cMv0lHZ72X/EAaOsG+3wAiXJSVZDeN5y0or1BYnq2BRLK
H0lIWapHbAKOnrgOUeB0BcEysNM397ctjraVDHG8+SJ2NhNGrsmp6roQXI2weSBL
1T+4nsFod6/LMoJyIKwASEgrVnhefvFmmID/dTq5JQAcR1Ryo2IAuJ2lMuJgRFsE
PXN2Dgv3HhYlzzMUp5b32K3Edo7BUO6vbb9PFWuMft/arTWq4gjZ8N7dsebRaC+Y
BXcyut565Lm+TIJ4RlOxA8K3U568CCz0PjRJzEu3PjZRJ46VjDIRTeysD6BqUcf0
hiXaQ8T5AgMBAAECggEABUpiCboenfKaEyyMKPQTaiaQ+byiDGiRZFub6IClJ177
KyodVfWU4ATFYha//Y0XHJmWkKX2oF55FaCH1qH+SN++H59pPYQBgsJmUhxrtffd
xZkcEc8fM0aemeksULsxQU8nOWjjH1PPPgO9qX2YntdR8/92g2WHeohwVan5DnSe
m7au5RbCIL4WkagFBOf5FxKi6kcDHb9JIW2pZAGk+am46+HSwxi088/2Iop4jKXe
ymJjWXKh39Uzp/Er3ov81RWkLaq2bynsLiQUNlrGtHzkmf6I3217BCDJZnHvSXrL
I3Jg6FZHFE7aAZuC9/qRmGksp1fY80clbbYkoBlRQwKBgQDvUEAVAMkDNavIMVNC
tZ5R5OnXyn8RrNkBAyPe9zFSOX1UUWC6HIz+Q1ktMZ4OjzMc6Ug3W+fidfr974m6
Tej0HYCQk6OC2ZExWxoLaVMfpuSZ4WP8HIc5BYvOkKNKCIxmPK3HUtak/mi7Duo7
WtY87T6dla5eVcCwBUJLDXYlFwKBgQDVWMmR8jUOk7aTxJSyZxk8uDsnM5Sc+gqy
notcJXln5W5PeOClc5SWtt3mQHEdl5X8vAiPtHNcG2/bkMAdFsERohWPG+iIEDs4
1eCxcocHKg4/ZEmoc/3EzhomLuK7IOGCzEAxqdhcMv2ip7HKlGHwSNVa8FCTRalc
IkceR7HQbwKBgG1ak13FlRT1YoDBIVW7XhP38W8c5gGypRqUT8Dj3dK/2Gg+I2AI
Cdlp9wbyxFHM18NfShOZ2JUf6kg9PAc48LkT/hqSjEYPmwwdoAIU59nvzkgOuTyL
4LKKuT7z0tnSnC1fjt0lGlYctsi7YQcsU/dVRaaGrj4HG1yTmp5nEVSTAoGBAIN1
SA7TzXmD7xYyJOWgvV46rshC8imfsIPLSVeoB5zLNCNn+hQ4mbAcUbKUtp5jTxoB
ysyxhfuVNGF4WcgSwzhYRSx/J9LfHX6x2te8GBOECG9rHi/b+NwRmu84KKDha9Mq
g8uWOijlin91EQogUBC88CoutZdpbyfEP0obJyelAoGAEGqhgyEn3qkzmE9ORIs+
o+b7VyTt3DKLuIQsg0B8cU31L5h34J82xHru48hWMtAkEjCEBV3wpRoGOys2iQfx
c93/Bc4cN5IoORBwR2yBv8VGd/bV0qlNkP+F60W4lw5Wv//2LLlsANhGmd9kO1rL
FZT7/HmWkgeZEMqMdauX6r8=
-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@project1-700e6.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=106430472719060285496

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=kietbackend@gmail.com
SMTP_PASSWORD=lyhk bzyn jxpz omoh
EMAIL_FROM=kietbackend@gmail.com

# ===========================================
# OTP CONFIGURATION
# ===========================================
OTP_LENGTH=6
OTP_EXPIRY=300
OTP_PROVIDER=email

# ===========================================
# JWT CONFIGURATION
# ===========================================
JWT_SECRET=g-3QI5D_dK4eK7aeXbZDCwbRZxRVUcYeMJbBgi6pZYgS1uViCezHbiP-jCne40m5
JWT_EXPIRY=1h

# ===========================================
# CACHE CONFIGURATION
# ===========================================
CACHE_TTL=300
CACHE_CHECKPERIOD=120

# ===========================================
# FILE UPLOAD SETTINGS
# ===========================================
UPLOAD_LIMIT=5mb
ALLOWED_FORMATS=jpg,jpeg,png,pdf,epub
STORAGE_PATH=uploads/

# ===========================================
# RATE LIMITING
# ===========================================
RATE_LIMIT=100
RATE_LIMIT_WINDOW=15

# ===========================================
# LOGGING
# ===========================================
LOG_LEVEL=info
LOG_FORMAT=combined

# ===========================================
# CORS
# ===========================================
CORS_ORIGIN=*
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=true
