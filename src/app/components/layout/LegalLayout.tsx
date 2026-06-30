import { useEffect } from 'react'
import { Container } from './Container'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

type LegalLayoutProps = {
  /** Document title, e.g. "Terms of Service — Tycho Systems". */
  title: string
  /** Pre-rendered HTML for the page body (markdown parsed with `marked`). */
  html: string
}

/**
 * Shared chrome for the legal pages. Renders markdown-derived HTML (the `.md`
 * files in src/content/legal are the single source of truth) inside the
 * observatory `.legal-prose` styling. The same HTML is prerendered to static
 * files by scripts/prerender-legal.ts so crawlers see real content.
 */
export function LegalLayout({ title, html }: LegalLayoutProps) {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <div className="min-h-dvh bg-[var(--bg-primary)]">
      <Navbar />
      <main className="py-[clamp(48px,8vw,96px)]">
        <Container>
          <article className="legal-prose mx-auto max-w-3xl text-[var(--text-body)]">
            <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--azure)]">
              [ Legal ]
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
