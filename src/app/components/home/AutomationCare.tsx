import { automationCare, site } from '../../../config/site'
import { track } from '../../lib/analytics'

/**
 * Ongoing maintenance offer — deliberately separated from the four primary
 * service cards. Gold-bordered "after launch" treatment carried over from the
 * original care callout.
 */
export function AutomationCare() {
  return (
    <section
      id="automation-care"
      className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] pb-[clamp(56px,8vw,104px)]"
    >
      <div
        className="rounded-2xl border px-[clamp(24px,4vw,44px)] py-[clamp(28px,4vw,44px)]"
        style={{
          borderColor: 'color-mix(in srgb, var(--gold) 28%, transparent)',
          background: 'color-mix(in srgb, var(--gold) 5%, transparent)',
        }}
      >
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--gold)]">
          ↻ After launch
        </div>
        <h2 className="m-0 max-w-[620px] font-display text-[clamp(24px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
          {automationCare.heading}
        </h2>
        <p className="mb-6 mt-4 max-w-[680px] text-[15.5px] leading-[1.65] text-[var(--text-secondary)]">
          {automationCare.supporting}
        </p>
        <ul className="m-0 mb-7 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-[10px] p-0">
          {automationCare.includes.map((item) => (
            <li
              key={item}
              className="flex items-baseline gap-2 text-[14px] leading-[1.5] text-[var(--text-muted)]"
            >
              <span aria-hidden="true" className="font-mono text-[12px] text-[var(--gold)]">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent('Automation Care')}`}
          onClick={() => track('audit_cta_clicked', { cta: 'automation_care' })}
          className="inline-flex items-center gap-2 rounded-[11px] border px-[22px] py-[12px] text-[15px] font-semibold text-[var(--gold)] transition-colors hover:bg-[color-mix(in_srgb,var(--gold)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
          style={{ borderColor: 'color-mix(in srgb, var(--gold) 40%, transparent)' }}
        >
          {automationCare.cta}
          <span aria-hidden="true" className="font-mono">
            →
          </span>
        </a>
      </div>
    </section>
  )
}
