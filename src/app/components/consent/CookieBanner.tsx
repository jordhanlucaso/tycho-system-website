import { Link } from 'react-router'
import { acceptAll, rejectNonEssential } from '../../lib/consent/manager'

type CookieBannerProps = {
  /** Opens the preference panel. */
  onManage: () => void
}

/**
 * First-run notice. Shown only while no decision exists.
 *
 * "Accept all" and "Reject non-essential" deliberately share one class string:
 * same size, weight, contrast and shape, one click each, no colour nudging
 * either way. "Manage preferences" is the third option, not a way to bury the
 * reject path.
 *
 * The banner does not trap focus and does not cover the page — the site stays
 * fully usable whether or not a choice has been made, and no optional storage
 * is written until one of these buttons is pressed.
 */

const decisionButton =
  'inline-flex flex-1 items-center justify-center gap-2 rounded-[11px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-[22px] py-[13px] text-[15px] font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-surface-hover)] hover:border-[color-mix(in_srgb,var(--text-primary)_24%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)] sm:flex-none'

const manageButton =
  'inline-flex items-center justify-center rounded-[11px] px-[14px] py-[13px] text-[14px] font-medium text-[var(--text-muted)] underline underline-offset-4 transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)]'

const policyLink =
  'text-[var(--azure)] underline underline-offset-2 transition-colors hover:text-[var(--azure-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)]'

export function CookieBanner({ onManage }: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-primary)] bg-[var(--surface-solid)] shadow-[0_-8px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-[clamp(20px,6vw,80px)] py-[clamp(20px,3vw,28px)] lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="max-w-[62ch]">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
            Cookie notice
          </div>
          <h2
            id="cookie-banner-title"
            className="m-0 font-display text-[17px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]"
          >
            Cookies and similar technologies
          </h2>
          <p
            id="cookie-banner-description"
            className="mb-0 mt-2 text-[13.5px] leading-[1.65] text-[var(--text-muted)]"
          >
            We use a small number of strictly necessary technologies to keep the site working —
            signing you in, holding your basket together, remembering this choice and blocking
            automated abuse on our forms. Optional ones remember your theme and measure which
            pages and campaigns are useful. Nothing optional runs until you say so, and you can
            change your mind at any time.{' '}
            <Link to="/cookies" className={policyLink}>
              Cookie policy
            </Link>{' '}
            ·{' '}
            <Link to="/privacy" className={policyLink}>
              Privacy policy
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <button type="button" onClick={() => acceptAll()} className={decisionButton}>
            Accept all
          </button>
          <button type="button" onClick={() => rejectNonEssential()} className={decisionButton}>
            Reject non-essential
          </button>
          <button type="button" onClick={onManage} className={manageButton}>
            Manage preferences
          </button>
        </div>
      </div>
    </div>
  )
}
