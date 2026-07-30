import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SiteNav } from '../app/components/home/SiteNav'
import { SiteFooter } from '../app/components/home/SiteFooter'

/**
 * Regression guard for the subpage navigation bug: section links must be
 * route-aware (`/#section`) so they navigate home first from a subpage, rather
 * than bare `#section` anchors that resolve against the current path and do
 * nothing on e.g. /resources/*.
 */
function renderOnSubpage(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/resources/ai-operations-pain-map']}>{ui}</MemoryRouter>
  )
}

function hashHrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('a'))
    .map((a) => a.getAttribute('href') ?? '')
    .filter((h) => h.includes('#'))
}

describe('SiteNav section links from a subpage', () => {
  it('point at the homepage (/#section), never a bare #anchor', () => {
    const { container } = renderOnSubpage(<SiteNav />)
    const hrefs = hashHrefs(container)
    expect(hrefs).toContain('/#top')
    expect(hrefs).toContain('/#work')
    expect(hrefs).toContain('/#process')
    expect(hrefs).toContain('/#services')
    expect(hrefs).toContain('/#contact')
    // No bare hash anchors that would resolve against the current path.
    expect(hrefs.every((h) => h.startsWith('/#'))).toBe(true)
  })
})

describe('SiteFooter section links from a subpage', () => {
  it('point at the homepage (/#section), never a bare #anchor', () => {
    const { container } = renderOnSubpage(<SiteFooter />)
    const hrefs = hashHrefs(container)
    expect(hrefs).toContain('/#top')
    expect(hrefs).toContain('/#work')
    expect(hrefs).toContain('/#contact')
    expect(hrefs.every((h) => h.startsWith('/#'))).toBe(true)
  })
})
