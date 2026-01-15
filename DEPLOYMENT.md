# Deployment Guide

Quick reference for deploying the Amazon PPC Campaign Name Generator.

## Quick Start Checklist

- [ ] GitHub repository created and code pushed
- [ ] GitHub Personal Access Token created (with `repo` scope)
- [ ] Cloudflare account created
- [ ] Cloudflare Worker deployed
- [ ] Environment variables configured
- [ ] Frontend built and deployed to GitHub Pages

## Detailed Steps

### 1. GitHub Setup

```bash
# If not already done, initialize git and push
git add .
git commit -m "Add database integration and duplicate prevention"
git push origin main
```

### 2. Cloudflare Worker Deployment

```bash
# Login to Cloudflare
npx wrangler login

# Set GitHub token (you'll be prompted to paste it)
npx wrangler secret put GITHUB_TOKEN

# Deploy worker
npx wrangler deploy
```

**Important:** Copy the deployed URL (e.g., `https://amzppc-api.your-subdomain.workers.dev`)

### 3. Frontend Configuration

```bash
# Create .env file
echo "VITE_API_URL=https://your-worker-url.workers.dev" > .env

# Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 4. GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

### 5. Verify Deployment

1. Visit your GitHub Pages URL
2. Try generating a campaign
3. Check that it saves successfully
4. Verify campaigns appear in "View All Campaigns" tab

## Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=https://your-worker.workers.dev
```

### Cloudflare Worker (via wrangler.toml and secrets)
```toml
[env.production]
vars = { 
  GITHUB_REPO_OWNER = "moeghashim", 
  GITHUB_REPO_NAME = "amzppc" 
}
```

Secrets (set via `wrangler secret put`):
- `GITHUB_TOKEN` - Your GitHub Personal Access Token

## Testing Locally

```bash
# Start dev server
npm run dev

# Test worker locally (requires .dev.vars file)
npx wrangler dev
```

For local worker testing, create `.dev.vars`:
```env
GITHUB_TOKEN=your_github_token_here
```

## Troubleshooting

### Worker Returns 500 Error
- Check GitHub token is set: `npx wrangler secret list`
- Verify token has `repo` scope
- Check worker logs: `npx wrangler tail`

### Frontend Can't Connect to Worker
- Verify `VITE_API_URL` in `.env` matches deployed worker URL
- Rebuild after changing `.env`: `npm run build`
- Check browser console for CORS errors

### Campaigns Not Saving
- Verify `data/campaigns.json` exists in repository
- Check worker has write permissions
- Verify repository owner/name in `wrangler.toml`

## Updating After Changes

```bash
# Update worker
npx wrangler deploy

# Update frontend
npm run build
npm run deploy
```
