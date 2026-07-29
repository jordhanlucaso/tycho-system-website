import { useEffect } from 'react'
import { leadMagnets } from '../../../config/leadMagnets'
import type { ResourceSlug } from '../../../config/leadMagnets'
import { track } from '../../lib/analytics'
import { captureAttribution } from '../../lib/attribution'
import { useSeo } from '../../lib/seo'
import { SiteNav } from '../../components/home/SiteNav'
import { SiteFooter } from '../../components/home/SiteFooter'
import { LeadMagnetForm } from '../../components/resources/LeadMagnetForm'

type LeadMagnetPageProps = {
  resource: ResourceSlug
}

/**
 * Landing page for one lead magnet: page copy on the left, the two-step form
 * on the right. All copy comes from src/config/leadMagnets.ts.
 */
export function LeadMagnetPage({ resource }: LeadMagnetPageProps) {
  const config = leadMagnets[resource]

  useSeo({
    title: config.page.metaTitle,
    description: config.page.metaDescription,
    path: config.path,
  })

  useEffect(() => {
    captureAttribution()
    track('lead_magnet_page_viewed', { resource })
  }, [resource])

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-primary)] font-sans text-[var(--text-body)]">
      <SiteNav />
      <main>
        <section className="relative">
          <div
            aria-hidden="true"
            className="obs-glow pointer-events-none absolute left-1/2 top-[-160px] z-0 h-[420px] w-[800px] -translate-x-1/2"
          />
          <div className="relative z-[2] mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-[clamp(40px,6vw,72px)] px-[clamp(20px,6vw,80px)] py-[clamp(48px,7vw,96px)]">
            <div>
              <div className="mb-[14px] font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--azure)]">
                [ {config.page.eyebrow} ]
              </div>
              <h1 className="m-0 text-balance font-display text-[clamp(30px,4.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.025em] text-[var(--text-primary)]">
                {config.page.heading}
              </h1>
              <p className="mt-5 max-w-[520px] text-[clamp(15px,1.3vw,17px)] leading-[1.65] text-[var(--text-body)]">
                {config.page.supporting}
              </p>
              <p className="mt-5 max-w-[520px] rounded-[12px] border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 text-[14px] leading-[1.6] text-[var(--text-muted)]">
                {config.page.trust}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-solid)] p-[clamp(20px,3vw,32px)]">
              <h2 className="m-0 mb-5 font-display text-[20px] font-semibold text-[var(--text-primary)]" tabIndex={-1}>
                Get {config.title}
              </h2>
              <LeadMagnetForm resource={resource} submitCta={config.page.submitCta} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
