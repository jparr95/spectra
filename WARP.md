# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `npm install` - Install dependencies (run once, or after package.json changes)
- `npm run dev` - Start Vite dev server with hot module replacement
- `npm run build` - Build production bundle to `dist/` directory
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint on all JavaScript/JSX files
- `npm run test` - Run Vitest test suite in watch mode
- `npm test` - Same as `npm run test`

### Deployment
- `npm run predeploy` - Build the project (runs automatically before deploy)
- `npm run deploy` - Deploy to GitHub Pages using gh-pages (manual fallback)

Note: The README mentions automatic deployment via GitHub Actions, but `.github/workflows/` directory does not exist yet. Manual deployment is currently through `npm run deploy`.

## Architecture Overview

### Project Structure
This is a **React + Vite** static site that functions as a personal project hub. It's designed to showcase multiple web app projects, each deployed independently to Cloudflare Pages.

### Key Design Patterns

**Data-Driven Project Pages**
- All projects are defined in `src/projects.js` as a single source of truth
- Projects are derived from GitHub URLs with optional metadata overlays
- Adding/removing projects requires only editing this one file - routing, navigation, and pages update automatically

**Hash-Based Routing**
- Uses URL hash routing (`#/` and `#/project/:slug`) to work seamlessly with static hosting on Cloudflare Pages
- No server-side configuration needed
- Routes are parsed in `App.jsx` via `getRouteFromHash()`

**Custom Project Page Components**
- Projects can optionally include a custom React component via the `component` property in `projects.js`
- Example: `DiscBagApp` component in `src/project-pages/DiscBagApp.jsx`
- Custom components are embedded within the `ProjectPage` layout in `App.jsx`

### Important Files
- `src/projects.js` - Central project registry; modify this to add/remove projects
- `src/App.jsx` - Main application with routing logic, Home page, and ProjectPage components
- `src/App.css` - Layout and component styles
- `src/index.css` - Global typography and base styles
- `docs/ARCHITECTURE.md` - Detailed Cloudflare hosting architecture and deployment flow

### Project Metadata Schema
Projects in `src/projects.js` support:
- `githubUrl` (required) - GitHub repository URL
- `title` - Display name (auto-derived from repo name if omitted)
- `description` - Short summary for cards and pages
- `tags` - Array of tags for search and display
- `deploymentUrl` - Live deployment URL
- `status` - One of: `'live'`, `'development'`, `'archived'`
- `techStack` - Array of technologies used
- `component` - React component for custom interactive project pages
- `slug` - URL slug (auto-derived from repo name if omitted)

### Testing Setup
- Uses Vitest with jsdom environment
- Test setup in `src/setupTests.js` includes @testing-library/jest-dom matchers
- Tests located in `src/__tests__/`
- Vitest config in `vite.config.js` under `test` key

### ESLint Configuration
- Uses flat config format (`eslint.config.js`)
- Includes React Hooks and React Refresh plugins
- Custom rule: allows unused variables that start with uppercase (useful for React component imports)
- Ignores `dist/` directory

## Common Workflows

### Adding a New Project
1. Edit `src/projects.js`
2. Add new entry to `baseProjects` array with at minimum a `githubUrl`
3. Optionally add `title`, `description`, `tags`, `deploymentUrl`, `status`, and `techStack`
4. Save - the navbar, home page, and routing will update automatically
5. Build and deploy

### Creating a Custom Project Page
1. Create a new React component in `src/project-pages/YourComponent.jsx`
2. Import it in `src/projects.js`
3. Add `component: YourComponent` to the project's metadata object
4. The component will be rendered within the ProjectPage layout

### Deployment to Cloudflare Pages
- Intended deployment method: Cloudflare Pages with GitHub Actions (see README)
- Required GitHub Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- GitHub Actions workflow should be created at `.github/workflows/deploy.yml` (see README for template)
- Manual deployment alternative: build locally and upload `dist/` folder via Cloudflare dashboard

### Running Tests
- `npm test` runs in watch mode for development
- Tests use @testing-library/react for component testing
- Add new tests to `src/__tests__/` directory with `.test.jsx` extension
