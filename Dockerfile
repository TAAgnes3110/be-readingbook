# Sử dụng Node.js 18 LTS Alpine để có kích thước nhỏ gọn
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các dependencies cần thiết cho build và healthcheck
RUN apk add --no-cache python3 make g++ wget

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
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/health || exit 1

# Start ứng dụng
CMD ["npm", "start"]
