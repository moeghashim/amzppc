# Amazon PPC Campaign Name Generator

A React application that generates Amazon PPC campaign names for all ad types (SP Auto, SP Keywords, SP Product Targeting, SB, SBV, SD) and stores them in a GitHub repository using Cloudflare Workers.

## Features

- ✅ Generate 14 campaign name combinations for any ASIN and Product Slug
- ✅ Duplicate ASIN prevention
- ✅ Save campaigns to GitHub repository (version controlled)
- ✅ Searchable table of all saved campaigns
- ✅ Copy individual or all campaign names
- ✅ Modern, responsive UI with custom theme

## Tech Stack

- **Frontend**: React + Vite
- **Storage**: GitHub repository (`data/campaigns.json`)
- **Backend**: Cloudflare Workers (for secure GitHub API writes)
- **Deployment**: GitHub Pages (frontend) + Cloudflare Workers (API)

## Setup Instructions

### Prerequisites

1. Node.js (v18 or higher)
2. GitHub account
3. Cloudflare account (free tier works)

### Step 1: Clone and Install

```bash
git clone https://github.com/moeghashim/amzppc.git
cd amzppc
npm install
```

### Step 2: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "AMZPPC Worker")
4. Select scope: `repo` (full control of private repositories)
5. Generate and copy the token (save it securely!)

### Step 3: Deploy Cloudflare Worker

1. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Set GitHub token as secret:**
   ```bash
   npx wrangler secret put GITHUB_TOKEN
   ```
   Paste your GitHub token when prompted.

3. **Deploy the worker:**
   ```bash
   npx wrangler deploy
   ```

4. **Note the deployed URL:**
   After deployment, you'll see a URL like:
   ```
   https://amzppc-api.your-subdomain.workers.dev
   ```
   Copy this URL - you'll need it for the next step.

### Step 4: Configure Frontend

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Cloudflare Worker URL:**
   ```env
   VITE_API_URL=https://amzppc-api.your-subdomain.workers.dev
   ```

3. **Update `wrangler.toml` if needed:**
   If your GitHub username or repo name is different, update:
   ```toml
   [env.production]
   vars = { GITHUB_REPO_OWNER = "your-username", GITHUB_REPO_NAME = "amzppc" }
   ```

### Step 5: Build and Deploy

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

Your app will be available at: `https://your-username.github.io/amzppc/`

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
AMZPPC/
├── data/
│   └── campaigns.json          # Stores all campaigns (version controlled)
├── workers/
│   └── save-campaign.js        # Cloudflare Worker for GitHub API
├── src/
│   ├── components/
│   │   ├── CampaignGenerator.jsx
│   │   ├── CampaignsTable.jsx
│   │   ├── CampaignDetails.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── SuccessMessage.jsx
│   ├── services/
│   │   └── campaignService.js  # API service layer
│   └── utils/
│       └── campaignGenerator.js
├── wrangler.toml               # Cloudflare Workers config
└── package.json
```

## How It Works

1. **Reading Campaigns:**
   - Frontend fetches `data/campaigns.json` directly from GitHub raw content
   - No authentication needed (public repository)

2. **Writing Campaigns:**
   - Frontend sends POST request to Cloudflare Worker
   - Worker uses GitHub API (with secure token) to update `data/campaigns.json`
   - Changes are committed to the repository

3. **Duplicate Prevention:**
   - Before generating, checks if ASIN already exists
   - Prevents duplicate generation
   - Shows error message if ASIN exists

## Campaign Name Formats

The generator creates 14 campaign name combinations:

- **SP Auto (4)**: CLOSE, LOOSE, SUBS, COMP
- **SP Keywords (3)**: BROAD/EXPAND, PHRASE/CONTROL, EXACT/RANK
- **SP Product Targeting (2)**: ASIN/CONQUEST, CATEGORY/CONQUEST
- **SB (1)**: KW/BRAND/DEFENSE
- **SBV (1)**: KW/EXACT/SCALE
- **SD (3)**: VIEW/7D/RET, VIEW/14D/RET, VIEW/30D/RET

Format: `{ASIN} | {ProductSlug} | {AdType} | {TargetType} | {Detail} | {Intent}`

## Troubleshooting

### Worker deployment fails
- Make sure you're logged in: `npx wrangler login`
- Verify your GitHub token has `repo` scope
- Check `wrangler.toml` has correct repo owner/name

### Frontend can't save campaigns
- Verify `VITE_API_URL` in `.env` matches your deployed worker URL
- Check browser console for CORS errors
- Ensure worker is deployed and accessible

### Duplicate check not working
- Verify `data/campaigns.json` exists in repository
- Check GitHub raw content URL is accessible
- Clear browser cache and try again

## License

MIT
