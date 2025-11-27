import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

vi.mock('../projects', () => ({
  projects: [
    {
      slug: 'alpha-project',
      title: 'Alpha Project',
      description: 'First project description',
      githubUrl: 'https://github.com/example/alpha',
      tags: ['react'],
    },
    {
      slug: 'beta-project',
      title: 'Beta Project',
      description: 'Second project description',
      githubUrl: 'https://github.com/example/beta',
      tags: ['node'],
    },
  ],
}))

beforeEach(() => {
  window.location.hash = '#/'
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})

describe('App', () => {
  it('renders the home hero and project list', () => {
    render(<App />)
    expect(
      screen.getByText('A quiet place for projects and notes.'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Alpha Project').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Beta Project').length).toBeGreaterThan(0)
  })

  it('filters projects as the user types in the search input', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByPlaceholderText('Search projects…')
    await user.type(search, 'Beta')

    expect(screen.queryByRole('link', { name: 'Alpha Project' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Beta Project' }).length).toBeGreaterThan(0)
  })

  it('navigates to a project page using the hash route', () => {
    window.location.hash = '#/project/beta-project'
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Beta Project' })).toBeInTheDocument()
    expect(screen.getByText('Second project description')).toBeInTheDocument()
  })

  it('toggles the theme and persists the selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(toggle)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('spectra-theme')).toBe('dark')
  })
})


