import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { projects } from './projects'

const PAGES = {
  HOME: 'home',
  PROJECT: 'project',
}

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

function getInitialTheme() {
  if (typeof window === 'undefined') return THEMES.LIGHT
  const stored = window.localStorage.getItem('spectra-theme')
  if (stored === THEMES.DARK || stored === THEMES.LIGHT) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT
}

function getRouteFromHash() {
  const hash = window.location.hash || '#/'
  const clean = hash.replace(/^#\/?/, '')

  if (!clean) {
    return { page: PAGES.HOME }
  }

  const [segment, maybeSlug] = clean.split('/')

  if (segment === 'project' && maybeSlug) {
    return { page: PAGES.PROJECT, slug: maybeSlug }
  }

  return { page: PAGES.HOME }
}

function filterProjects(list, query) {
  if (!query.trim()) return list
  const q = query.toLowerCase()

  return list.filter((project) => {
    const haystack = [
      project.title ?? '',
      project.description ?? '',
      project.githubUrl ?? '',
      ...(project.tags ?? []),
      ...(project.techStack ?? []),
    ]

    return haystack.some((field) => field.toLowerCase().includes(q))
  })
}

function ThemeToggle({ theme, onToggleTheme }) {
  const nextTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  const label = `Switch to ${nextTheme} mode`

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggleTheme}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{theme === THEMES.DARK ? '☀︎' : '☾'}</span>
      <span className="theme-toggle-text">{theme === THEMES.DARK ? 'Light' : 'Dark'}</span>
    </button>
  )
}

function Navbar({ projects, searchQuery, onSearchChange, theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#/" className="navbar-title">
          spectra
        </a>
        <nav className="navbar-links" aria-label="Projects">
          {projects.map((project) => (
            <a
              key={project.slug}
              href={`#/project/${project.slug}`}
              className="navbar-link"
            >
              {project.title}
            </a>
          ))}
        </nav>
        <div className="navbar-actions">
          <div className="navbar-search">
            <input
              type="search"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label="Search projects"
            />
          </div>
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </header>
  )
}

function Home({ projects }) {
  return (
    <main className="page">
      <section className="home-hero">
        <p className="home-kicker">Personal log</p>
        <h1 className="home-title">A quiet place for projects and notes.</h1>
        <p className="home-subtitle">
          Minimal noise, mostly experiments. Each project has its own page with a short story,
          links, and a bit of context.
        </p>
      </section>

      <section className="home-list">
        <h2 className="section-title">Projects</h2>
        <div className="project-list">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className="project-card"
              style={{ '--card-index': index }}
            >
              <header className="project-card-header">
                <h3 className="project-card-title">
                  <a href={`#/project/${project.slug}`}>{project.title}</a>
                </h3>
                {project.tags && project.tags.length > 0 && (
                  <ul className="project-card-tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </header>
              {project.description && (
                <p className="project-card-description">{project.description}</p>
              )}
              <footer className="project-card-footer">
                <a
                  href={`#/project/${project.slug}`}
                  className="text-link subtle"
                >
                  Read more
                </a>
                {project.deploymentUrl && (
                  <a
                    href={project.deploymentUrl}
                    className="text-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    className="text-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}
              </footer>
              {project.status && (
                <div className="project-card-status">
                  <span className={`status-badge status-badge--${project.status}`}>
                    {project.status === 'live' ? '● Live' : project.status === 'archived' ? '◐ Archived' : '◯ Development'}
                  </span>
                </div>
              )}
            </article>
          ))}

          {projects.length === 0 && (
            <p className="empty-state">
              No projects yet. Add one in <code>src/projects.js</code>.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

function ProjectPage({ project }) {
  if (!project) {
    return (
      <main className="page">
        <section className="project-layout">
          <a href="#/" className="back-link">
            ← Back to all projects
          </a>
          <h1>Project not found</h1>
          <p>
            The project you were looking for doesn’t exist. It may have been renamed or removed from{' '}
            <code>src/projects.js</code>.
          </p>
        </section>
      </main>
    )
  }

  const ProjectComponent = project.component ?? null
  const layoutClass = ProjectComponent ? 'project-layout project-layout--immersive' : 'project-layout'

  return (
    <main className="page">
      <section className={layoutClass}>
        <a href="#/" className="back-link">
          ← Back to all projects
        </a>
        <h1 className="project-title">{project.title}</h1>
        {project.tags && project.tags.length > 0 && (
          <ul className="project-tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        {project.description && (
          <p
            className={
              ProjectComponent ? 'project-description project-description--subtle' : 'project-description'
            }
          >
            {project.description}
          </p>
        )}

        {(project.deploymentUrl || project.githubUrl) && (
          <div className="project-links">
            {project.deploymentUrl && (
              <a
                href={project.deploymentUrl}
                className="primary-link"
                target="_blank"
                rel="noreferrer"
              >
                View Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className={project.deploymentUrl ? "secondary-link" : "primary-link"}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            )}
          </div>
        )}
        {project.status && (
          <div className="project-status">
            <span className={`status-badge status-badge--${project.status}`}>
              {project.status === 'live' ? '● Live' : project.status === 'archived' ? '◐ Archived' : '◯ Development'}
            </span>
          </div>
        )}
        {project.techStack && project.techStack.length > 0 && (
          <div className="project-tech-stack">
            <h3 className="project-tech-stack-title">Tech Stack</h3>
            <ul className="project-tech-stack-list">
              {project.techStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {ProjectComponent ? (
          <div className="project-app-surface" role="region" aria-label={`${project.title} interactive view`}>
            <ProjectComponent />
          </div>
        ) : (
          <div className="project-notes">
            <p>
              This page is intentionally minimal. Use it as a short write-up: what the project is,
              why it exists, and anything you learnt along the way.
            </p>
            <p>
              To customize this copy, edit the corresponding entry in <code>src/projects.js</code>{' '}
              or extend this component.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(() => getRouteFromHash())
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => getInitialTheme())

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('spectra-theme', theme)
  }, [theme])

  const visibleProjects = useMemo(
    () => filterProjects(projects, searchQuery),
    [searchQuery],
  )

  const currentProject =
    route.page === PAGES.PROJECT
      ? projects.find((project) => project.slug === route.slug)
      : null

  const toggleTheme = () =>
    setTheme((current) => (current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK))

  return (
    <div className="app">
      <div className="shell">
        <Navbar
          projects={visibleProjects}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {route.page === PAGES.PROJECT ? (
          <ProjectPage project={currentProject} />
        ) : (
          <Home projects={visibleProjects} />
        )}

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} — Built with React, Vite, and Cloudflare Pages.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
