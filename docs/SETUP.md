# Setup Guide

Quick reference for setting up the Spectra hub site on Cloudflare Pages.

## Prerequisites

- Cloudflare account
- GitHub repository for this hub site
- Node.js 20+ installed locally (for development)

## Initial Setup

### 1. Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create a project
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework preset**: Vite (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
4. Note your project name (defaults to repository name, e.g., `spectra`)

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

1. **CLOUDFLARE_API_TOKEN**
   - Create token: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template or create custom token with:
     - Account → Cloudflare Pages → Edit
   - Copy token and add as secret

2. **CLOUDFLARE_ACCOUNT_ID**
   - Find in: Cloudflare Dashboard → Right sidebar → Account ID
   - Copy and add as secret

### 3. Update Workflow Configuration

Edit `.github/workflows/deploy.yml` and update the `projectName` field if your Cloudflare Pages project name differs from `spectra`:

```yaml
projectName: your-actual-project-name
```

### 4. Test Deployment

1. Push to `main` branch
2. Check GitHub Actions tab for workflow run
3. Once complete, visit your Cloudflare Pages deployment URL

## Custom Domain (Optional)

1. In Cloudflare Pages dashboard → Your project → Custom domains → Set up a custom domain
2. Add your domain (e.g., `yourdomain.com`)
3. Cloudflare will automatically configure DNS and SSL

## Adding Projects

See [README.md](../README.md#adding-a-new-project-step-by-step) for instructions on adding projects to the hub.

## Troubleshooting

### Workflow Fails

- Verify secrets are correctly set in GitHub repository settings
- Check Cloudflare API token has correct permissions
- Ensure Cloudflare Pages project exists with matching name

### Build Errors

- Run `npm run build` locally to test
- Check Node.js version matches workflow (currently 20)
- Verify all dependencies are in `package.json`

### Deployment Not Updating

- Check GitHub Actions workflow completed successfully
- Verify Cloudflare Pages project is connected to correct branch (`main`)
- Clear Cloudflare cache if needed (Dashboard → Caching → Purge Everything)

