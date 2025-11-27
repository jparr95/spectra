# Cloudflare Architecture & Hosting Flow

## Overview

This personal hub site is hosted on **Cloudflare Pages**, which serves as the central showcase for all your web app projects. Each individual app repository can deploy its own UI build to Cloudflare Pages, and this hub site links to or embeds those deployments.

## Architecture Components

### 1. Main Hub Site (This Repository)

- **Hosting**: Cloudflare Pages
- **Build**: Vite/React static site
- **Deployment**: Automatic via GitHub Actions on push to `main` branch
- **Domain**: Your custom domain (configured in Cloudflare Pages)
- **Purpose**: Central index and navigation hub for all projects

### 2. Individual App Repositories

Each app repository follows a consistent pattern:

- **Hosting**: Separate Cloudflare Pages project (or alternative hosting)
- **Build**: Each repo builds its own UI artifacts
- **Deployment**: Independent CI/CD pipeline per repo
- **URL Pattern**: `https://app-name.pages.dev` or custom subdomain

### 3. Integration Approaches

#### Option A: Separate Cloudflare Pages Projects (Recommended)

Each app repo deploys to its own Cloudflare Pages project:

- **Pros**: Independent deployments, isolated environments, easy rollbacks
- **Cons**: Requires managing multiple Cloudflare Pages projects
- **URL Structure**: 
  - Hub: `https://yourdomain.com`
  - App 1: `https://app1.pages.dev` or `https://app1.yourdomain.com`
  - App 2: `https://app2.pages.dev` or `https://app2.yourdomain.com`

#### Option B: Monorepo with Subpaths

All apps build into a single Cloudflare Pages project with subpaths:

- **Pros**: Single deployment, unified domain
- **Cons**: Coupled deployments, larger build times
- **URL Structure**:
  - Hub: `https://yourdomain.com`
  - App 1: `https://yourdomain.com/apps/app1`
  - App 2: `https://yourdomain.com/apps/app2`

**Note**: This plan assumes Option A (separate projects) for better isolation and independent scaling.

## Data Flow

```
┌─────────────────┐
│  App Repo 1     │ ──build──> Cloudflare Pages ──> https://app1.pages.dev
│  (GitHub)       │
└─────────────────┘

┌─────────────────┐
│  App Repo 2     │ ──build──> Cloudflare Pages ──> https://app2.pages.dev
│  (GitHub)       │
└─────────────────┘

┌─────────────────┐
│  Hub Repo       │ ──build──> Cloudflare Pages ──> https://yourdomain.com
│  (This Repo)    │
└─────────────────┘
         │
         └──> Reads metadata from src/projects.js
              └──> Links to app deployments
```

## Cloudflare Services Used

### Cloudflare Pages
- **Primary Service**: Static site hosting for both hub and individual apps
- **Features**: 
  - Automatic HTTPS
  - Global CDN
  - Preview deployments for PRs
  - Custom domains
  - Build environment variables

### Optional: Cloudflare Workers
- **Use Case**: API proxies, dynamic routing, or serverless functions if needed
- **Current**: Not required for static hub site

### Optional: Cloudflare R2
- **Use Case**: Shared asset storage (images, media) if apps need to share resources
- **Current**: Not required initially

## Deployment Flow

### Hub Site Deployment

1. Developer pushes code to `main` branch
2. GitHub Actions workflow triggers
3. Workflow builds the site (`npm run build`)
4. Workflow deploys to Cloudflare Pages via Wrangler/Pages API
5. Cloudflare Pages serves the site globally

### App Site Deployment

1. Developer pushes code to app repo's `main` branch
2. App's GitHub Actions workflow triggers
3. Workflow builds the app (`npm run build` or similar)
4. Workflow deploys to app's Cloudflare Pages project
5. App is live at its own URL
6. (Optional) App can notify hub or hub polls for updates

## Domain Configuration

### Hub Domain
- Configure custom domain in Cloudflare Pages dashboard
- DNS records managed in Cloudflare DNS
- SSL/TLS handled automatically by Cloudflare

### App Domains
- Each app can use:
  - Default `.pages.dev` subdomain (automatic)
  - Custom subdomain (e.g., `app1.yourdomain.com`)
  - Fully custom domain

## Environment Variables

### Hub Site
- `CLOUDFLARE_API_TOKEN`: For automated deployments (stored as GitHub secret)
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (stored as GitHub secret)

### App Sites
- Each app manages its own environment variables
- No shared state between hub and apps (by design)

## Future Enhancements

- **Dynamic Registry**: Replace static `projects.js` with a JSON API endpoint
- **Analytics**: Integrate Cloudflare Web Analytics for traffic insights
- **Preview Builds**: Link to preview deployments for PRs
- **Status Monitoring**: Health checks for app deployments
- **Auth-Gated Demos**: Use Cloudflare Access for private demos

