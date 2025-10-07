#!/bin/bash

# Deploy script cho VPS/Server
echo "🚀 Deploying Reading Book API..."

# Cập nhật code
git pull origin main

# Build và chạy với Docker
docker-compose down
docker-compose up --build -d

# Kiểm tra trạng thái
docker-compose ps

echo "✅ Deploy completed!"
echo "🌐 API available at: http://your-server-ip:9000/api/v1"
