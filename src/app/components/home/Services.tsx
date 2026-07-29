import { services } from '../../../config/services'
import type { Service } from '../../../config/services'
import { track } from '../../lib/analytics'
import { SectionLabel } from '../ui/SectionLabel'

const icons: Record<Service['icon'], React.ReactNode> = {
  compass: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="var(--azure)" strokeWidth="1.2" />
      <path d="M13 7l-2 4-4 2 2-4 4-2z" fill="var(--azure)" opacity="0.85" />
    </svg>
  ),
  signal: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 15c2.5 0 2.5-10 5-10s2.5 10 5 10 2.5-10 4-10" stroke="var(--azure)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16" cy="5" r="1.6" fill="var(--gold)" />
    </svg>
  ),
  ledger: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="var(--azure)" strokeWidth="1.2" />
      <path d="M6.5 8h7M6.5 11h7M6.5 14h4" stroke="var(--azure)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  orbit: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="var(--azure)" strokeWidth="1.1" />
      <circle cx="10" cy="10" r="3.4" stroke="var(--azure)" strokeWidth="1.1" opacity="0.55" />
      <circle cx="15.5" cy="5.5" r="1.7" fill="var(--gold)" />
    </svg>
  ),
}

/**
 * The four primary services, rendered from src/config/services.ts. Each card
 * lists typical deliverables and carries its own CTA into the contact section.
 */
export function Services() {
  return (
    <section
      id="services"
      className="border-t border-[var(--border-primary)]"
      style={{ background: 'rgba(255,255,255,0.012)' }}
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]">
        <SectionLabel className="mb-[14px]">What we build</SectionLabel>
        <h2 className="m-0 mb-[clamp(32px,4vw,52px)] max-w-[680px] font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)]">
          Practical systems that reduce repetitive work.
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-solid)] px-6 py-[26px]"
            >
              <div className="mb-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[color-mix(in_srgb,var(--azure)_30%,transparent)]">
                {icons[service.icon]}
              </div>
              <h3 className="mb-[9px] font-display text-[19px] font-semibold text-[var(--text-primary)]">
                {service.title}
              </h3>
              <p className="m-0 text-[14.5px] font-medium leading-[1.6] text-[var(--text-secondary)]">
                {service.shortDesc}
              </p>
              <p className="mb-4 mt-[10px] text-[14px] leading-[1.6] text-[var(--text-muted)]">
                {service.longDesc}
              </p>
              <ul className="m-0 mb-5 list-none space-y-[6px] p-0">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-2 text-[13.5px] leading-[1.5] text-[var(--text-muted)]"
                  >
                    <span aria-hidden="true" className="font-mono text-[11px] text-[var(--azure)]">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={service.ctaHref}
                onClick={() => track('service_card_clicked', { service: service.id })}
                className="mt-auto inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--azure)] transition-colors hover:text-[var(--azure-hover)]"
              >
                {service.cta}
                <span aria-hidden="true" className="font-mono">
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
