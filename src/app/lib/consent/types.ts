/**
 * Consent vocabulary shared by the manager, the UI and the gated services.
 *
 * Only categories that map to a technology the site actually uses are shown to
 * visitors (see `CATEGORY_DEFINITIONS[].active`). `marketing` is declared so the
 * record shape stays stable if a pixel is ever added, but it is inert today:
 * nothing registers against it, it is never rendered, and it can never be
 * granted through the UI.
 */

export const CONSENT_CATEGORIES = ['necessary', 'functional', 'analytics', 'marketing'] as const

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number]

/** Optional categories — everything a visitor can actually decide about. */
export type OptionalConsentCategory = Exclude<ConsentCategory, 'necessary'>

export type ConsentState = Record<ConsentCategory, boolean>

/** How the stored decision was made. Recorded for the audit trail. */
export type ConsentMethod = 'accept_all' | 'reject_non_essential' | 'custom'

/**
 * Bump when the categories or the technologies behind them change materially.
 * A record written under an older schema is treated as "no decision yet", so
 * the banner reappears and the visitor is asked again.
 */
export const CONSENT_SCHEMA_VERSION = 1

/**
 * The persisted decision. Deliberately free of anything identifying — no IP,
 * no user agent, no id. It is a record of *what* was chosen, not *who* chose it.
 */
export type ConsentRecord = {
  /** Schema version this record was written under. */
  v: number
  /** Granted state per category. `necessary` is always true. */
  categories: ConsentState
  /** ISO-8601 timestamp of the decision. */
  timestamp: string
  /** Which control produced the decision. */
  method: ConsentMethod
}

export type CategoryDefinition = {
  id: ConsentCategory
  /** Heading shown in the preference panel. */
  title: string
  /** Why this category exists, in plain language. */
  description: string
  /** What is actually stored/loaded — kept in sync with the cookie policy. */
  examples: string
  /** Necessary cannot be switched off. */
  required: boolean
  /**
   * False when the site currently uses no technology in this category. Inactive
   * categories are never rendered and can never be granted.
   */
  active: boolean
}

/**
 * The live inventory. Every entry here is backed by something the audit found
 * in this repository; see src/content/legal/cookie-policy.md for the
 * visitor-facing version of the same table.
 */
export const CATEGORY_DEFINITIONS: readonly CategoryDefinition[] = [
  {
    id: 'necessary',
    title: 'Strictly necessary',
    description:
      'Required for the site to work. These keep you signed in to the client portal, hold your basket and checkout details together across pages, remember this cookie choice, and let our bot protection tell a person from an automated script.',
    examples:
      'Sign-in session, basket and checkout hand-off, your cookie preferences, reCAPTCHA bot protection.',
    required: true,
    active: true,
  },
  {
    id: 'functional',
    title: 'Functional',
    description:
      'Remembers preferences you set so the site looks the same next time. Turning this off does not break anything — your choice simply resets when you close the tab.',
    examples: 'Light/dark theme preference.',
    required: false,
    active: true,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description:
      'Helps us understand which pages and campaigns are useful, in aggregate. We do not build profiles and we do not track you across other websites.',
    examples:
      'Campaign attribution for the current visit (UTM tags and referrer), and privacy-friendly page statistics if we enable them.',
    required: false,
    active: true,
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description:
      'Advertising and remarketing technologies. Tycho Systems does not use any, so there is nothing to switch on here.',
    examples: 'None in use.',
    required: false,
    active: false,
  },
]

/** Categories a visitor is actually shown and asked about. */
export const ACTIVE_CATEGORIES: readonly CategoryDefinition[] = CATEGORY_DEFINITIONS.filter(
  (category) => category.active
)

/** Nothing optional is on until the visitor turns it on. */
export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

/** Everything the site actually uses. Inactive categories stay false. */
export const ALL_GRANTED_CONSENT: ConsentState = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
}
