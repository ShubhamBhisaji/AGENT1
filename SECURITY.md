# Security Guide

Protect your application and API keys.

## 🚨 Critical: Your Exposed API Key

**Your API key was shared in this conversation:**
```
<REDACTED_API_KEY>
```

**⚠️ IMMEDIATE ACTIONS REQUIRED:**

1. **Regenerate the key immediately:**
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Click the key you used
   - Delete it
   - Create a new API key
   - Update `.env.local` with the new key

2. **Revoke all old keys:**
   - In Google Cloud Console
   - Go to APIs & Services → Credentials
   - Delete any exposed API keys

3. **Monitor usage:**
   - Check your Google Cloud billing for unusual activity
   - Set up billing alerts to detect anomalies

## 🔐 Best Practices for API Keys

### DO ✅
- ✅ Store keys in `.env.local` (environment variables)
- ✅ Use different keys for dev and production
- ✅ Rotate keys periodically (every 3-6 months)
- ✅ Use short-lived API keys when possible
- ✅ Restrict key scope to necessary APIs only
- ✅ Monitor API usage and costs
- ✅ Log API access for audit trails
- ✅ Set up billing alerts
- ✅ Use service accounts for server-to-server auth
- ✅ Implement rate limiting on your API

### DON'T ❌
- ❌ Commit `.env.local` to Git
- ❌ Hardcode API keys in source code
- ❌ Share keys in public repositories
- ❌ Share keys in email or chat
- ❌ Use the same key across environments
- ❌ Expose keys in error messages
- ❌ Log API keys
- ❌ Use keys in frontend code
- ❌ Share keys with team members directly
- ❌ Use keys without rate limiting

## 🛡️ Server-Side API Integration

This app uses **server-side** API handling for security:

```typescript
// ✅ SECURE: API key on server only (app/api/chat/route.ts)
const apiKey = process.env.GOOGLE_API_KEY; // Server-side only
const response = await fetch('...', {
  headers: { 'x-goog-api-key': apiKey } // Never exposed to client
});
```

**Why this matters:**
- API key stays on the server
- Never sent to the browser
- Client never sees the key
- Reduces attack surface

## 🔒 Environment Variables

### Development
**.env.local** (Do NOT commit)
```env
GOOGLE_API_KEY=your_dev_key_here
NODE_ENV=development
```

### Production
Set in hosting platform's environment settings:
- Vercel: Dashboard → Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment
- AWS: Systems Manager Parameter Store or Secrets Manager

**Never use `.env.production.local` in Git.**

## 🚨 Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Add to app/api/chat/route.ts
const rateLimitMap = new Map();

function checkRateLimit(ip: string): boolean {
  const limit = 10; // requests
  const window = 60000; // milliseconds (1 minute)

  const now = Date.now();
  const records = rateLimitMap.get(ip) || [];

  const validRecords = records.filter(time => now - time < window);

  if (validRecords.length >= limit) {
    return false; // Rate limited
  }

  validRecords.push(now);
  rateLimitMap.set(ip, validRecords);
  return true;
}
```

## 📋 Credential Rotation Checklist

Every 3-6 months:

- [ ] Generate new API key
- [ ] Test with new key
- [ ] Update `.env.local` or production env vars
- [ ] Verify app works with new key
- [ ] Delete old key
- [ ] Document rotation date
- [ ] Update team notes

## 🔍 Monitoring & Alerts

### Set Up Billing Alerts
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Billing → Budgets and alerts
3. Create budget alert at $10/month (or your threshold)
4. Receive email when approaching limit

### Monitor API Usage
```javascript
// Add to your app to track usage
async function logAPIUsage() {
  const usage = {
    timestamp: new Date(),
    endpoint: '/api/chat',
    tokens: responseLength,
    cost: estimatedCost,
  };
  // Send to your logging service
}
```

## 🛡️ CORS & Origins

Restrict API calls to your domain:

```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  // Verify request origin
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
  ];

  if (!allowedOrigins.includes(origin || '')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // ... rest of handler
}
```

## 🚨 Error Handling Security

**DON'T leak sensitive info in errors:**

```typescript
// ❌ BAD - Exposes API key
catch (error) {
  console.error('API Error:', error); // Could expose key
}

// ✅ GOOD - Generic error message
catch (error) {
  console.error('API Error occurred');
  return NextResponse.json(
    { error: 'Failed to process request' },
    { status: 500 }
  );
}
```

## 🔐 Git Security

### Configure Git to prevent accidents

```bash
# Prevent committing .env files
git rm --cached .env.local
git commit -m "Remove env file"

# Use git-secrets (optional)
brew install git-secrets
git secrets --install
git secrets --register-aws

# Configure pre-commit hook
echo 'GOOGLE_API_KEY' >> .git/info/exclude
```

## 📱 API Key Scoping (Advanced)

In Google Cloud Console:

1. Go to Credentials
2. Click your API key
3. Restrict key to:
   - APIs: Only "Generative Language API"
   - HTTP referrers: Your domain only
   - IP addresses: Your server's static IP (if applicable)

## 🆘 If Your Key Is Compromised

1. **Immediately delete the compromised key** in Google Cloud Console
2. **Create a new key** and update `.env.local`
3. **Check API usage** for unauthorized access
4. **Review billing** for suspicious charges
5. **Update application** with new key
6. **Monitor closely** for next 24-48 hours
7. **Document the incident** for your records

## 🔗 Security Resources

- [Google Cloud Security Best Practices](https://cloud.google.com/docs/authentication/production)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Next.js Security Best Practices](https://nextjs.org/docs/basic-features/environment-variables)
- [Secret Management Guide](https://secrets.nix.how/)

## 🎯 Security Checklist for Production

Before deploying:

- [ ] API key is rotated and secure
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Rate limiting implemented
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Error handling doesn't leak secrets
- [ ] Monitoring & alerting set up
- [ ] Billing alerts configured
- [ ] Team informed of key rotation policy

---

**Remember:** Security is an ongoing process, not a one-time task. Stay vigilant! 🛡️
