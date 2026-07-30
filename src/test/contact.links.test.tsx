import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { SiteFooter } from '../app/components/home/SiteFooter'
import { Contact } from '../app/components/blocks/Contact'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

function mailtoHrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('a[href^="mailto:"]')).map((a) =>
    a.getAttribute('href') ?? ''
  )
}

describe('footer contact links', () => {
  it('surfaces the general contact and support addresses', () => {
    const { container } = renderWithRouter(<SiteFooter />)
    const hrefs = mailtoHrefs(container)
    expect(hrefs).toContain('mailto:contact@tychosystem.com')
    expect(hrefs.some((h) => h.startsWith('mailto:support@tychosystem.com'))).toBe(true)
  })
})

describe('contact page links', () => {
  it('surfaces general, founder and support addresses', () => {
    const { container } = renderWithRouter(<Contact />)
    const hrefs = mailtoHrefs(container)
    expect(hrefs.some((h) => h.startsWith('mailto:contact@tychosystem.com'))).toBe(true)
    expect(hrefs.some((h) => h.startsWith('mailto:jordhan@tychosystem.com'))).toBe(true)
    expect(hrefs.some((h) => h.startsWith('mailto:support@tychosystem.com'))).toBe(true)
  })
})
