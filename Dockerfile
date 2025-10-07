# Sử dụng Node.js 18 LTS Alpine để có kích thước nhỏ gọn
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các dependencies cần thiết cho build
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Tạo user không phải root để bảo mật
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Tạo thư mục uploads và cấp quyền
RUN mkdir -p uploads && chown -R nodejs:nodejs /app

# Chuyển sang user nodejs
USER nodejs

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start ứng dụng
CMD ["npm", "start"]
