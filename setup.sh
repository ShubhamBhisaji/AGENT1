#!/bin/bash

# Gemini AI Chat Platform - Setup Script
# This script sets up the development environment

echo "🚀 Gemini AI Chat Platform - Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "🔑 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your GOOGLE_API_KEY"
    echo "   Get your key from: https://aistudio.google.com/apikey"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local and add your Google API key"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
