# App Repository CI/CD Template

This document provides a template for setting up CI/CD in your individual app repositories that deploy to Cloudflare Pages.

## GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your app repository:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          # Add your build-time environment variables here
          # Example:
          # VITE_API_URL: ${{ secrets.VITE_API_URL }}
          # VITE_APP_ENV: production
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-app-name  # Replace with your Cloudflare Pages project name
          directory: dist  # Replace with your build output directory if different
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Required GitHub Secrets

Add these secrets to your app repository's GitHub Settings → Secrets and variables → Actions:

1. **CLOUDFLARE_API_TOKEN**
   - Create at: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template or create custom token with:
     - Account → Cloudflare Pages → Edit permissions
   - Copy the token and add as `CLOUDFLARE_API_TOKEN` secret

2. **CLOUDFLARE_ACCOUNT_ID**
   - Find in: Cloudflare Dashboard → Right sidebar → Account ID
   - Copy and add as `CLOUDFLARE_ACCOUNT_ID` secret

3. **GITHUB_TOKEN** (automatic)
   - Provided automatically by GitHub Actions
   - Used for PR comment integration

## Cloudflare Pages Project Setup

Before the workflow can deploy, create the Pages project:

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect your GitHub repository
3. Configure build settings (these can be overridden by the workflow):
   - **Framework preset**: Select your framework (Vite, Next.js, etc.) or "None"
   - **Build command**: `npm run build` (or your build command)
   - **Build output directory**: `dist` (or your output directory)
   - **Root directory**: `/` (or your app root if in monorepo)
4. Save the project name (used in workflow's `projectName` field)

## Customization

### Different Build Output Directory

If your app outputs to a different directory (e.g., `build`, `out`, `.next`):

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    # ... other config ...
    directory: build  # Change this
```

### Environment Variables

Add build-time environment variables in the Build step:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
    VITE_APP_ENV: production
    NODE_ENV: production
```

### Custom Branch Deployments

To deploy from a different branch:

```yaml
on:
  push:
    branches:
      - production  # Change this
```

### Preview Deployments

Preview deployments are automatically created for pull requests. The workflow above includes `pull_request` trigger, and Cloudflare Pages will create preview URLs that are commented on PRs (if `gitHubToken` is provided).

## Testing Locally

Before pushing, test your build locally:

```bash
npm run build
# Verify dist/ (or your output directory) contains expected files
```

## Troubleshooting

### Build Fails

- Check build command matches your `package.json` scripts
- Verify Node.js version matches your app's requirements
- Check for missing environment variables

### Deployment Fails

- Verify `CLOUDFLARE_API_TOKEN` has correct permissions
- Ensure `CLOUDFLARE_ACCOUNT_ID` is correct
- Check that Cloudflare Pages project exists with matching `projectName`
- Verify `directory` path matches your build output

### Preview Deployments Not Working

- Ensure `gitHubToken` is set (uses `GITHUB_TOKEN` automatically)
- Check that workflow includes `pull_request` trigger
- Verify GitHub Actions has write permissions for PR comments

## Integration with Hub Site

After deploying your app:

1. Note the deployment URL (e.g., `https://your-app.pages.dev`)
2. Update `src/projects.js` in the hub repository:
   ```js
   {
     githubUrl: 'https://github.com/your-username/your-app',
     deploymentUrl: 'https://your-app.pages.dev',
     status: 'live',
     // ... other fields
   }
   ```
3. Push to hub repo's `main` branch to update the hub site

