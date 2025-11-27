## Spectra

Minimal personal site powered by React, Vite, and Cloudflare Pages.

The home page is a quiet, blog-like index of your projects. Each project has its own page, generated automatically from a central list of GitHub repository URLs. This hub site showcases all your web app projects, with each app deployed independently to Cloudflare Pages.

---

### Running locally

- **Install dependencies** (once):

```bash
npm install
```

- **Start the dev server**:

```bash
npm run dev
```

Then open the printed local URL in your browser.

---

### Deploying to Cloudflare Pages

This project is configured for Cloudflare Pages deployment via GitHub Actions. See the [CI/CD workflows](#cicd--automation) section below for setup instructions.

**Manual deployment** (for testing):

```bash
npm run build
# Then upload the dist/ folder to Cloudflare Pages via dashboard or Wrangler CLI
```

**Automatic deployment** happens via GitHub Actions when you push to the `main` branch (see `.github/workflows/deploy.yml`).

For detailed architecture information, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

### How project pages work

- All projects live in `src/projects.js`.
- The navbar, search, home list, and individual project pages are generated from that file.
- Routing uses the URL hash (`#/project/your-project`) so it works smoothly with Cloudflare Pages without extra configuration.

You should **not** need to touch any routing or layout code to add or remove projects—only `src/projects.js`.

---

### Adding a new project (step‑by‑step)

1. **Open the projects file**
   - Edit `src/projects.js`.

2. **Copy the existing example entry**
   - Inside `baseProjects`, duplicate the example object:

```js
const baseProjects = [
  {
    githubUrl: 'https://github.com/YOUR_GITHUB_USERNAME/spectra',
    title: 'Spectra',
    description: 'The codebase that powers this site, built with React and Vite.',
    tags: ['react', 'vite', 'github-pages'],
  },
  // Paste the next project below this comment
]
```

3. **Paste your GitHub repository URL**
   - Change only the `githubUrl` value in your new entry:

```js
  {
    githubUrl: 'https://github.com/YOUR_GITHUB_USERNAME/your-new-project',
  },
```

4. **(Optional) Add metadata**
   - You can provide any of these optional fields:
     - `title`: Human‑readable project name (defaults to a title‑cased repo name).
     - `description`: Short text shown on the home page and project page.
     - `tags`: Array of strings used for small pills and search.
     - `deploymentUrl`: Live deployment URL (e.g., `https://your-app.pages.dev`).
     - `status`: Project status - `'live'`, `'development'`, or `'archived'` (defaults to `'development'`).
     - `techStack`: Array of technologies used (e.g., `['React', 'TypeScript', 'Vite']`).

```js
  {
    githubUrl: 'https://github.com/YOUR_GITHUB_USERNAME/your-new-project',
    title: 'Your New Project',
    description: 'Short, one‑sentence summary of what this project is.',
    tags: ['python', 'cli'],
    deploymentUrl: 'https://your-new-project.pages.dev',
    status: 'live',
    techStack: ['Python', 'FastAPI', 'React'],
  },
```

5. **Save the file**
   - The new project will automatically:
     - Appear in the navbar.
     - Be included in search results.
     - Show up on the main (home) page.
     - Get its own page at `#/project/your-new-project` (slug derived from the repo name).

6. **Redeploy**
   - After adding or editing projects, push to `main` branch and GitHub Actions will automatically deploy to Cloudflare Pages.

---

### Integrating App Repositories

Each app repository should deploy independently to Cloudflare Pages. Follow these conventions for consistency:

#### App Repository Setup

1. **Create a Cloudflare Pages project** for your app:
   - Go to Cloudflare Dashboard → Pages → Create a project
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build` (or your app's build command)
     - **Build output directory**: `dist` (or your app's output directory)
     - **Root directory**: `/` (or your app's root if in a monorepo)

2. **Naming Convention** (recommended):
   - Use descriptive project names (e.g., `my-app-name`)
   - Cloudflare will assign a `.pages.dev` subdomain automatically
   - Optionally configure a custom subdomain (e.g., `app1.yourdomain.com`)

3. **Add deployment URL to hub**:
   - Update `src/projects.js` in this repository with the `deploymentUrl` field
   - Example: `deploymentUrl: 'https://my-app-name.pages.dev'`

#### App Repository CI/CD

Each app repo should have its own GitHub Actions workflow for automatic deployments. See the [CI/CD & Automation](#cicd--automation) section for a template workflow.

#### Branch Strategy

- **Main branch**: Production deployments (automatic)
- **Preview deployments**: Cloudflare Pages automatically creates preview deployments for pull requests

#### Environment Variables

- Store app-specific environment variables in Cloudflare Pages dashboard
- Use Cloudflare's environment variable management (not committed to repo)
- Each app manages its own variables independently

---

### CI/CD & Automation

#### Hub Site (This Repository)

The hub site uses GitHub Actions to automatically deploy to Cloudflare Pages on push to `main`. See `.github/workflows/deploy.yml` for the workflow configuration.

**Required GitHub Secrets**:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

**Workflow Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies (`npm ci`)
4. Build site (`npm run build`)
5. Deploy to Cloudflare Pages via Wrangler

#### App Repositories

Each app repository should have a similar GitHub Actions workflow. Create `.github/workflows/deploy.yml` in each app repo:

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
      - uses: actions/checkout@v4
      
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
          # VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-app-name
          directory: dist
          # Optional: gitHubToken for PR comments
          # gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

**App Repository Secrets**:
- `CLOUDFLARE_API_TOKEN`: Same token as hub (or create app-specific token)
- `CLOUDFLARE_ACCOUNT_ID`: Same account ID as hub

**Note**: Replace `your-app-name` with your actual Cloudflare Pages project name.

---

### Notes

- The site uses hash‑based routing (`#/…`), which works smoothly with Cloudflare Pages.
- All styling for the layout lives in `src/App.css`; global typography and base styles live in `src/index.css`.
- To customize copy for an individual project, update its entry in `src/projects.js`. If you need more complex content (screenshots, sections, etc.), extend the `ProjectPage` component in `src/App.jsx`.
- For architecture details, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
