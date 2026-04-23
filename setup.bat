@echo off
setlocal enabledelayedexpansion

REM Gemini AI Chat Platform - Setup Script (Windows)
REM This script sets up the development environment

echo 🚀 Gemini AI Chat Platform - Setup
echo ==================================

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%

echo.
echo 📦 Installing dependencies...
call npm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo.
    echo 🔑 Creating .env.local file...
    copy .env.example .env.local
    echo ⚠️  Please edit .env.local and add your GOOGLE_API_KEY
    echo    Get your key from: https://aistudio.google.com/apikey
) else (
    echo ✅ .env.local already exists
)

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit .env.local and add your Google API key
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.

pause
