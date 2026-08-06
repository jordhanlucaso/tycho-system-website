import { openConsentPreferences } from '../../lib/consent/manager'

type CookieSettingsButtonProps = {
  className?: string
}

/**
 * The persistent "Cookie settings" control for the site footers.
 *
 * Withdrawing has to be as easy as consenting, so this is always present —
 * before a choice, after accepting, and after rejecting — and reopens the same
 * panel every time. It talks to the manager singleton rather than a context, so
 * it works from any footer without a provider above it.
 */
export function CookieSettingsButton({ className = '' }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => openConsentPreferences()}
      className={`text-left transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${className}`}
    >
      Cookie settings
    </button>
  )
}
