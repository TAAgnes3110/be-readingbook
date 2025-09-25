#!/usr/bin/env node

/**
 * Setup script cho Reading Book API
 * Tự động kiểm tra và hướng dẫn setup cho team mới
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors cho console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkNodeVersion() {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);

    if (majorVersion >= 18) {
      log(`✅ Node.js version: ${version}`, 'green');
      return true;
    } else {
      log(`❌ Node.js version: ${version} (cần >= 18.x)`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Không thể kiểm tra Node.js version`, 'red');
    return false;
  }
}

function checkNpmVersion() {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.split('.')[0]);

    if (majorVersion >= 9) {
      log(`✅ npm version: ${version}`, 'green');
      return true;
    } else {
      log(`❌ npm version: ${version} (cần >= 9.x)`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Không thể kiểm tra npm version`, 'red');
    return false;
  }
}

function checkDependencies() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log(`✅ Dependencies đã cài đặt`, 'green');
    return true;
  } else {
    log(`❌ Dependencies chưa cài đặt`, 'red');
    return false;
  }
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');

  if (fs.existsSync(envPath)) {
    log(`✅ File .env đã tồn tại`, 'green');
    return true;
  }

  if (fs.existsSync(envExamplePath)) {
    try {
      fs.copyFileSync(envExamplePath, envPath);
      log(`✅ Đã tạo file .env từ env.example`, 'green');
      log(`⚠️  Vui lòng cập nhật các giá trị trong file .env`, 'yellow');
      return true;
    } catch (error) {
      log(`❌ Không thể tạo file .env: ${error.message}`, 'red');
      return false;
    }
  } else {
    log(`❌ File env.example không tồn tại`, 'red');
    return false;
  }
}

function createLogsDirectory() {
  const logsPath = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsPath)) {
    try {
      fs.mkdirSync(logsPath, { recursive: true });
      log(`✅ Đã tạo thư mục logs`, 'green');
    } catch (error) {
      log(`❌ Không thể tạo thư mục logs: ${error.message}`, 'red');
    }
  } else {
    log(`✅ Thư mục logs đã tồn tại`, 'green');
  }
}

function showNextSteps() {
  log('\n📋 Các bước tiếp theo:', 'cyan');
  log('1. Cập nhật file .env với thông tin thực tế', 'yellow');
  log('2. Đặt file serviceAccountKey.json vào thư mục gốc', 'yellow');
  log('3. Chạy: npm run dev', 'yellow');
  log('4. Kiểm tra: http://localhost:3000/health', 'yellow');

  log('\n📖 Xem hướng dẫn chi tiết:', 'cyan');
  log('- README.md: Tổng quan dự án', 'blue');
  log('- SETUP_GUIDE.md: Hướng dẫn setup từng bước', 'blue');
  log('- env.example: Template cho file .env', 'blue');
}

function main() {
  log('🚀 Reading Book API - Setup Checker', 'bright');
  log('=====================================\n', 'bright');

  let allGood = true;

  // Kiểm tra Node.js và npm
  log('🔍 Kiểm tra môi trường:', 'cyan');
  allGood &= checkNodeVersion();
  allGood &= checkNpmVersion();

  // Kiểm tra dependencies
  log('\n📦 Kiểm tra dependencies:', 'cyan');
  allGood &= checkDependencies();

  // Kiểm tra files cấu hình
  log('\n⚙️  Kiểm tra cấu hình:', 'cyan');
  allGood &= checkFile('.env', 'File .env');
  allGood &= checkFile('serviceAccountKey.json', 'File serviceAccountKey.json');
  allGood &= checkFile('env.example', 'File env.example');

  // Tạo file .env nếu chưa có
  if (!fs.existsSync('.env')) {
    log('\n🔧 Tạo file cấu hình:', 'cyan');
    createEnvFile();
  }

  // Tạo thư mục logs
  log('\n📁 Tạo thư mục cần thiết:', 'cyan');
  createLogsDirectory();

  // Kết quả
  log('\n' + '='.repeat(50), 'bright');
  if (allGood) {
    log('🎉 Setup hoàn tất! Bạn có thể chạy: npm run dev', 'green');
  } else {
    log('⚠️  Cần hoàn thiện một số bước setup', 'yellow');
  }

  showNextSteps();

  log('\n🆘 Cần hỗ trợ? Xem SETUP_GUIDE.md hoặc liên hệ team!', 'magenta');
}

// Chạy script
if (require.main === module) {
  main();
}

module.exports = { main };

