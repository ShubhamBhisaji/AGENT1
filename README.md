# Devi AI — Powered by Tecbunny Solutions

A modern, production-ready web platform for interacting with Google Gemini 2.5 Flash AI model. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

✨ **Core Features:**
- Real-time chat interface with Gemini AI
- Message history within session
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Auto-scrolling to latest messages
- Clear chat history button
- Smooth animations and transitions

🎨 **Design:**
- Modern dark theme with gradient accents
- Glassmorphism UI elements
- Tailwind CSS for styling
- Cyberpunk-inspired color scheme

⚡ **Performance:**
- Server-side API integration (secure API key handling)
- Lazy loading and optimized bundle
- Fast page loads with Next.js
- Efficient state management

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # Gemini API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Chat page (main UI)
│   └── globals.css                # Global styles
├── public/
│   └── favicon.ico               # Favicon
├── package.json                  # Dependencies
├── next.config.js                # Next.js config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── postcss.config.js             # PostCSS config
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Prerequisites

- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- npm or yarn package manager
- Google Cloud API key for Gemini

## Installation

### 1. Clone or Extract Project

```bash
cd path/to/gemini-ai-chat-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google API key:

```
GOOGLE_API_KEY=your_actual_api_key_here
```

**How to get your API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `.env.local`

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Usage

1. **Start the dev server:** `npm run dev`
2. **Open in browser:** Navigate to http://localhost:3000
3. **Type your prompt:** Enter any question or command in the input field
4. **Send:** Click "Send" button or press Enter
5. **View response:** AI response appears in the chat
6. **Clear history:** Click "Clear Chat" button to reset

## API Endpoint

**POST** `/api/chat`

### Request Body

```json
{
  "prompt": "What is machine learning?",
  "messages": []
}
```

### Response

```json
{
  "success": true,
  "message": "Machine learning is a subset of artificial intelligence..."
}
```

### Error Response

```json
{
  "error": "Error description",
  "details": "Additional error information"
}
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Next.js 15 |
| **Language** | TypeScript 5.3 |
| **Styling** | Tailwind CSS 3.4 |
| **AI Model** | Google Gemini 2.5 Flash |
| **Runtime** | Node.js 18+ |
| **Build** | Next.js App Router |

## Configuration

### Environment Variables

```env
# Required
GOOGLE_API_KEY=your_key_here
```

### Tailwind Customization

Edit `tailwind.config.ts` to change:
- Colors (primary, secondary, background, accent)
- Animation speeds
- Fonts and sizing

### Next.js Configuration

Edit `next.config.js` for:
- Build optimization
- API route settings
- Image optimization

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never** commit `.env.local` to version control
2. **Never** expose API keys in client-side code (handled server-side in `/api/chat`)
3. Always use HTTPS in production
4. Consider adding rate limiting for API calls
5. Validate user input on server-side
6. Implement authentication if needed for production

## Performance Optimization

- Messages rendered with React keys for efficiency
- Lazy loading with Next.js dynamic imports
- CSS animations use GPU acceleration (transform, opacity)
- API calls optimized with proper error handling
- Tailwind purges unused CSS in production

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Key Not Working
- Verify key is correct in `.env.local`
- Check that `.env.local` is NOT in `.gitignore` issues
- Restart dev server after changing `.env.local`

### Messages Not Sending
- Check browser console for errors (F12)
- Verify API endpoint is accessible
- Ensure API key has Gemini API enabled

### Styling Issues
- Clear `.next` cache: `rm -rf .next`
- Reinstall Tailwind: `npm install`
- Check `tailwind.config.ts` syntax

### Port Already in Use
- Change port: `npm run dev -- -p 3001`
- Or kill process using port 3000

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Chat history persistence
- [ ] Multi-model selection (Gemini 1.5 Pro, etc.)
- [ ] Message editing and deletion
- [ ] Export chat as PDF/text
- [ ] Dark/Light theme toggle
- [ ] System prompts/persona selection
- [ ] Code highlighting in responses
- [ ] Voice input/output
- [ ] Conversation sharing

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Gemini API documentation](https://ai.google.dev/docs)
3. Review troubleshooting section above

## Resources

- [Google Gemini Enterprise Agent Platform Docs](https://docs.cloud.google.com/gemini-enterprise-agent-platform)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google AI Studio](https://aistudio.google.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Made with ❤️ using Next.js and Google Gemini AI**
