# Deployment Guide

Deploy your Gemini AI Chat Platform to production.

## Deployment Options

### 1. Vercel (Recommended - Free Tier Available)

Vercel is the official Next.js hosting platform.

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/gemini-ai-chat
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Add New..." → "Project"
   - Select your repository
   - Click "Import"

3. **Set Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add: `GOOGLE_API_KEY=your_key_here`
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `yourproject.vercel.app`

### 2. Netlify

**Steps:**

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Connect to Git"
   - Select GitHub and authorize
   - Choose your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Go to "Site settings" → "Build & deploy" → "Environment"
   - Add `GOOGLE_API_KEY=your_key_here`

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live

### 3. AWS (EC2 / ECS)

**Using EC2:**

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/gemini-ai-chat
cd gemini-ai-chat

# Install and build
npm install
npm run build

# Set environment variable
export GOOGLE_API_KEY=your_key_here

# Start application
npm start
```

Set up a reverse proxy with Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**

```bash
docker build -t gemini-ai-chat .
docker run -e GOOGLE_API_KEY=your_key_here -p 3000:3000 gemini-ai-chat
```

### 5. Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variable `GOOGLE_API_KEY`
6. Click "Deploy"

## Pre-Deployment Checklist

- [ ] API key is NOT in code (use .env.local)
- [ ] `.env.local` is in `.gitignore`
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes all checks
- [ ] Test in production build: `npm run build && npm start`
- [ ] Set up proper HTTPS/SSL certificate
- [ ] Configure domain name (if applicable)
- [ ] Set up monitoring/error tracking
- [ ] Plan for API rate limiting

## Environment Variables for Production

```env
GOOGLE_API_KEY=your_production_key_here
NODE_ENV=production
```

## Performance Optimization for Production

### Next.js Built-in Optimization
- Image optimization is automatic
- Code splitting and lazy loading enabled
- CSS is minified
- Static generation where possible

### Additional Tips
1. **Enable caching headers** in your hosting provider
2. **Use CDN** for assets (Vercel does this automatically)
3. **Monitor API usage** to avoid quota limits
4. **Set up error tracking** (Sentry, LogRocket)
5. **Enable compression** (gzip, brotli)

## Monitoring & Logging

### Vercel Analytics (Free)
- Automatic Web Vitals tracking
- Real user monitoring
- Performance insights

### Third-party Services
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Full monitoring
- **New Relic**: APM and monitoring

## Security Best Practices

1. **HTTPS Only**
   - Always use HTTPS in production
   - Enable HSTS headers

2. **API Rate Limiting**
   - Limit requests per IP
   - Implement user-level quotas

3. **CORS Configuration**
   - Only allow trusted origins
   - Validate request origins

4. **API Key Rotation**
   - Rotate API keys periodically
   - Use key versioning

5. **Secrets Management**
   - Use platform's secret manager
   - Never commit secrets
   - Use environment variables

## Scaling Considerations

As your app grows:

1. **Database** (when adding persistence)
   - PostgreSQL recommended
   - Use connection pooling

2. **Caching Layer**
   - Redis for session caching
   - CDN for static assets

3. **API Optimization**
   - Implement request batching
   - Add response caching
   - Rate limiting

4. **Monitoring**
   - Set up alerting
   - Track error rates
   - Monitor API quotas

## Rollback & Versioning

- Keep previous versions available
- Tag releases in Git: `git tag -a v1.0.0 -m "Version 1.0.0"`
- One-click rollback with Vercel/Netlify
- Keep .next builds cached

## Support & Troubleshooting

**"Build fails on deployment?"**
- Check build logs for errors
- Verify all dependencies are in package.json
- Ensure .env.example has all required vars

**"App crashes in production?"**
- Check server logs
- Verify API key is set
- Check for memory issues

**"API quota exceeded?"**
- Upgrade Gemini API plan
- Implement rate limiting
- Cache responses

## Cost Estimation

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free-$20/mo | Free tier includes generous limits |
| Netlify | Free-$19/mo | Good for hobby projects |
| AWS EC2 | ~$5-20/mo | Requires manual setup |
| Railway | Pay-as-you-go | Transparent pricing |
| Google Gemini API | Free-$1.50/1M tokens | Usage-based pricing |

Choose based on your traffic and budget.

---

**Ready to deploy?** Start with Vercel - it's the easiest option for Next.js apps!
