// Central place to list your projects.
// To add a new project page, copy an entry in baseProjects and change only the githubUrl.
// The nav, routing, and pages will update automatically.

import DiscBagApp from './project-pages/DiscBagApp'

/**
 * Project metadata structure:
 * @typedef {Object} Project
 * @property {string} githubUrl - GitHub repository URL (required)
 * @property {string} [title] - Human-readable project name (defaults to title-cased repo name)
 * @property {string} [description] - Short description shown on cards and project pages
 * @property {string[]} [tags] - Array of tags for filtering and display
 * @property {string} [deploymentUrl] - Live deployment URL (Cloudflare Pages or other)
 * @property {'live'|'development'|'archived'} [status] - Project status (defaults to 'development')
 * @property {string[]} [techStack] - Technologies used (e.g., ['React', 'TypeScript', 'Vite'])
 * @property {React.Component} [component] - Optional React component for interactive project page
 * @property {string} [slug] - URL slug (auto-derived from repo name if not provided)
 */

const baseProjects = [
  {
    githubUrl: 'https://github.com/YOUR_GITHUB_USERNAME/spectra',
    title: 'Spectra',
    description: 'The codebase that powers this site, built with React and Vite.',
    tags: ['react', 'vite', 'cloudflare'],
    deploymentUrl: 'https://yourdomain.com',
    status: 'live',
    techStack: ['React', 'Vite', 'Cloudflare Pages'],
  },
  {
    githubUrl: 'https://github.com/jparr95/In-The-Bag.git',
    title: 'Disc Golf: In The Bag',
    description: 'Interactive bag builder that tracks every disc and slot.',
    tags: ['disc golf', 'react', 'data viz'],
    deploymentUrl: 'https://in-the-bag.pages.dev', // Example - update with actual URL
    status: 'live',
    techStack: ['React', 'Vite'],
    component: DiscBagApp,
  },
  // Add more projects here by pasting a GitHub URL.
]

function parseGithubUrl(urlString) {
  try {
    const url = new URL(urlString)
    const parts = url.pathname.split('/').filter(Boolean)

    if (parts.length < 2) return null

    const [owner, repo] = parts
    return { owner, repo }
  } catch {
    return null
  }
}

function toTitleCase(text) {
  return text
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function deriveProjectMeta(project) {
  const parsed = parseGithubUrl(project.githubUrl)

  const repoName = parsed?.repo ?? ''
  const slug = project.slug ?? repoName.toLowerCase()

  const title =
    project.title ??
    (repoName ? toTitleCase(repoName) : project.githubUrl.replace(/^https?:\/\//, ''))

  return {
    ...project,
    slug,
    title,
    owner: parsed?.owner ?? null,
    repo: parsed?.repo ?? null,
  }
}

export const projects = baseProjects.map(deriveProjectMeta)


