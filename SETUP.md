# Quick Setup Guide

## Current Status ✅

- ✅ GitHub repository: `moeghashim/amzppc`
- ✅ Code pushed to main branch
- ✅ Frontend deployed to GitHub Pages
- ✅ All dependencies installed
- ✅ Build verified working

## What's Left to Do

### 1. Deploy Cloudflare Worker (Required for saving campaigns)

```bash
# Login to Cloudflare
npx wrangler login

# Create GitHub Personal Access Token first:
# - Go to: https://github.com/settings/tokens
# - Click "Generate new token (classic)"
# - Select scope: "repo"
# - Copy the token

# Set the token as a secret
npx wrangler secret put GITHUB_TOKEN
# Paste your token when prompted

# Deploy the worker
npx wrangler deploy
```

**After deployment, you'll get a URL like:**
```
https://amzppc-api.your-subdomain.workers.dev
```

### 2. Configure Frontend Environment

```bash
# Create .env file with your worker URL
echo "VITE_API_URL=https://your-worker-url.workers.dev" > .env

# Rebuild and redeploy
npm run build
npm run deploy
```

### 3. Test the Application

1. Visit: https://moeghashim.github.io/amzppc/
2. Try generating a campaign
3. Click "Save Campaigns" (will work after Cloudflare Worker is deployed)
4. Check "View All Campaigns" tab

## Troubleshooting

**If saving doesn't work:**
- Verify Cloudflare Worker is deployed and accessible
- Check `VITE_API_URL` in `.env` matches your worker URL
- Rebuild frontend after changing `.env`

**If duplicate check doesn't work:**
- Verify `data/campaigns.json` exists in repository
- Check GitHub raw content URL is accessible

## Files Created

- `data/campaigns.json` - Stores all campaigns (version controlled)
- `workers/save-campaign.js` - Cloudflare Worker for GitHub API
- `wrangler.toml` - Cloudflare Workers configuration
- `src/services/campaignService.js` - API service layer
- All UI components for table, details, errors, etc.

Everything is ready - just need to deploy the Cloudflare Worker!
