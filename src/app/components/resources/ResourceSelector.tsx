import { useEffect } from 'react'
import { Link } from 'react-router'
import { leadMagnets, resourceSelector } from '../../../config/leadMagnets'
import type { ResourceSlug } from '../../../config/leadMagnets'
import { track } from '../../lib/analytics'
import { SectionLabel } from '../ui/SectionLabel'

type ResourceSelectorProps = {
  /** Where the selector is rendered — recorded on analytics events. */
  context: 'home' | 'resources_page'
  /** Render the audience statements ("I lead a business or team.") above the cards. */
  showAudienceStatements?: boolean
}

/**
 * The two-card audience selector: Business Leaders get the AI Operations Pain
 * Map, AI Builders and Learners get the Practical AI Dictionary. All copy
 * comes from src/config/leadMagnets.ts.
 */
export function ResourceSelector({ context, showAudienceStatements = false }: ResourceSelectorProps) {
  useEffect(() => {
    track('resource_selector_viewed', { context })
  }, [context])

  const statementFor = (slug: ResourceSlug) =>
    resourceSelector.audienceChoices.find((c) => c.slug === slug)?.statement

  return (
    <div>
      <SectionLabel className="mb-[14px]">Free guides</SectionLabel>
      <h2 className="m-0 max-w-[680px] font-display text-[clamp(26px,3.6vw,42px)] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--text-primary)]">
        {resourceSelector.heading}
      </h2>
      <p className="mb-[clamp(28px,4vw,44px)] mt-4 max-w-[680px] text-[15.5px] leading-[1.65] text-[var(--text-muted)]">
        {resourceSelector.supporting}
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px]">
        {Object.values(leadMagnets).map((resource) => (
          <article
            key={resource.slug}
            className="flex flex-col rounded-2xl border border-[color-mix(in_srgb,var(--azure)_24%,transparent)] px-6 py-[26px]"
            style={{
              background: 'linear-gradient(180deg, rgba(111,168,255,0.06), rgba(111,168,255,0.015))',
            }}
          >
            {showAudienceStatements && (
              <p className="m-0 mb-3 font-display text-[17px] font-medium text-[var(--text-secondary)]">
                “{statementFor(resource.slug)}”
              </p>
            )}
            <div className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--azure)]">
              {resource.card.label}
            </div>
            <h3 className="m-0 mb-[10px] font-display text-[22px] font-semibold leading-[1.15] text-[var(--text-primary)]">
              {resource.title}
            </h3>
            <p className="m-0 mb-6 text-[14.5px] leading-[1.6] text-[var(--text-muted)]">
              {resource.card.description}
            </p>
            <Link
              to={resource.path}
              onClick={() => track('resource_selected', { resource: resource.slug, context })}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-[11px] bg-[var(--azure)] px-[22px] py-[12px] text-[15px] font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--azure-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
            >
              {resource.card.cta}
              <span aria-hidden="true" className="font-mono">
                →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
