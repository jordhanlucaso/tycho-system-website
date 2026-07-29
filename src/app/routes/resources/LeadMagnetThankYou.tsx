import { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router'
import { businessPainOptions, labelFor, leadMagnets } from '../../../config/leadMagnets'
import type { AudienceSegment } from '../../../config/leadMagnets'
import { site } from '../../../config/site'
import { track } from '../../lib/analytics'
import { useSeo } from '../../lib/seo'
import { LEAD_MAGNET_RESULT_KEY } from '../../lib/leadMagnetApi'
import type { StoredLeadMagnetResult } from '../../lib/leadMagnetApi'
import { SiteNav } from '../../components/home/SiteNav'
import { SiteFooter } from '../../components/home/SiteFooter'

type LeadMagnetThankYouProps = {
  variant: AudienceSegment
}

function readStoredResult(): StoredLeadMagnetResult | null {
  try {
    const raw = sessionStorage.getItem(LEAD_MAGNET_RESULT_KEY)
    return raw ? (JSON.parse(raw) as StoredLeadMagnetResult) : null
  } catch {
    return null
  }
}

const copy = {
  business_leader: {
    heading: 'Your AI Operations Pain Map is ready.',
    supporting: 'Based on your answers, the business-leader guide is the most relevant starting point.',
    resource: leadMagnets.ai_operations_pain_map,
    secondaryActions: [
      { label: 'View services', to: '/#services' },
      { label: 'Book a workflow audit', href: `mailto:${site.email}?subject=${encodeURIComponent('Workflow audit request')}`, event: 'booking_clicked' as const },
    ],
  },
  ai_builder_learner: {
    heading: 'Your Practical AI Dictionary is ready.',
    supporting: 'Based on your answers, the AI Dictionary is the most relevant starting point.',
    resource: leadMagnets.ai_dictionary,
    secondaryActions: [
      { label: 'View learning resources', to: '/resources' },
      { label: 'Explore workflow examples', to: '/#services' },
    ],
  },
}

/**
 * Thank-you page for a delivered lead magnet. Reads the submission result from
 * router state (or sessionStorage after a refresh) to show the download link,
 * the visitor's selected pain point, and a friendly note when the delivered
 * resource differs from the one originally requested.
 */
export function LeadMagnetThankYou({ variant }: LeadMagnetThankYouProps) {
  const location = useLocation()
  const result = useMemo(
    () => (location.state as StoredLeadMagnetResult | null) ?? readStoredResult(),
    [location.state]
  )

  const c = copy[variant]
  const downloadUrl = result?.deliveredResource.downloadUrl ?? c.resource.downloadPath
  const crossDelivered = Boolean(
    result && result.requestedResource !== result.deliveredResource.slug
  )
  const painLabel =
    variant === 'business_leader'
      ? labelFor(businessPainOptions, result?.primaryBusinessPain)
      : undefined

  useSeo({
    title: `${c.resource.title} — Ready | ${site.agencyName}`,
    description: c.supporting,
    path: c.resource.thankYouPath,
    noindex: true,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-primary)] font-sans text-[var(--text-body)]">
      <SiteNav />
      <main>
        <section className="relative">
          <div
            aria-hidden="true"
            className="obs-glow pointer-events-none absolute left-1/2 top-[-160px] z-0 h-[420px] w-[800px] -translate-x-1/2"
          />
          <div className="relative z-[2] mx-auto max-w-[760px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]">
            <div className="mb-[14px] font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--azure)]">
              [ Delivered ]
            </div>
            <h1 className="m-0 text-balance font-display text-[clamp(30px,4.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.025em] text-[var(--text-primary)]">
              {result?.firstName ? `${result.firstName}, your guide is ready.` : c.heading}
            </h1>
            <p className="mt-5 text-[16px] leading-[1.65] text-[var(--text-body)]" role="status">
              {c.supporting}
            </p>

            {crossDelivered && (
              <p className="mt-4 rounded-[12px] border border-[color-mix(in_srgb,var(--gold)_30%,transparent)] bg-[color-mix(in_srgb,var(--gold)_6%,transparent)] p-4 text-[14.5px] leading-[1.65] text-[var(--text-secondary)]">
                Based on the role and goal you selected, we have sent the resource that is likely
                to be most useful to you: <strong>{result?.deliveredResource.title}</strong>.
              </p>
            )}

            {painLabel && (
              <p className="mt-4 text-[14.5px] leading-[1.65] text-[var(--text-muted)]">
                You told us your biggest bottleneck is <strong className="text-[var(--text-secondary)]">{painLabel.toLowerCase()}</strong>{' '}
                — the guide includes a dedicated section on exactly that problem.
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={downloadUrl}
                download
                onClick={() =>
                  track('pdf_download_clicked', {
                    resource: result?.deliveredResource.slug ?? c.resource.slug,
                  })
                }
                className="inline-flex items-center gap-2 rounded-[11px] bg-[var(--azure)] px-[24px] py-[13px] text-[15px] font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--azure-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
              >
                Download the PDF
                <span aria-hidden="true" className="font-mono">
                  ↓
                </span>
              </a>
              {c.secondaryActions.map((action) =>
                'to' in action && action.to ? (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="inline-flex items-center gap-2 rounded-[11px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-[20px] py-[13px] text-[15px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-surface-hover)]"
                  >
                    {action.label}
                  </Link>
                ) : (
                  <a
                    key={action.label}
                    href={'href' in action ? action.href : '#'}
                    onClick={() => {
                      if ('event' in action && action.event) track(action.event)
                    }}
                    className="inline-flex items-center gap-2 rounded-[11px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-[20px] py-[13px] text-[15px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-surface-hover)]"
                  >
                    {action.label}
                  </a>
                )
              )}
            </div>

            <p className="mt-8 rounded-[12px] border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 text-[14px] leading-[1.65] text-[var(--text-muted)]">
              We have also emailed you a copy so you can find it later. If it has not arrived
              within a few minutes, check your spam folder — or email{' '}
              <a href={`mailto:${site.email}`} className="text-[var(--azure)] underline underline-offset-2">
                {site.email}
              </a>{' '}
              and we will send it directly.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
