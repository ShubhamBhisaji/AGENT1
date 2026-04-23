# Quick Start Guide

Get your Gemini AI Chat Platform running in 5 minutes.

## ⚡ Quick Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy your API key

### Step 3: Configure Environment

Create `.env.local` file in the project root:

**On Windows:**
```bash
copy .env.example .env.local
```

**On macOS/Linux:**
```bash
cp .env.example .env.local
```

Then edit `.env.local` and replace with your API key:
```env
GOOGLE_API_KEY=your_actual_api_key_here
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

## 🎉 You're Ready!

Start chatting with Gemini AI. Type any question and hit Send.

## ⚠️ Important

- **NEVER** share your API key
- **NEVER** commit `.env.local` to Git
- Keep `.env.local` in `.gitignore` (already configured)

## 🆘 Troubleshooting

**"API key not configured"?**
- Make sure `.env.local` exists in project root
- Make sure it contains `GOOGLE_API_KEY=your_key`
- Restart dev server after editing `.env.local`

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Want to build for production?**
```bash
npm run build
npm start
```

## 📚 Learn More

- [Full README](./README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
