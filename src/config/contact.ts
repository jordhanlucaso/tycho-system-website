/**
 * Centralised business-email configuration.
 *
 * Single source of truth for every Tycho Systems address used across the
 * public site and (mirrored in `server/src/config/contact.ts`) the server.
 * Replace hard-coded addresses with references to `emails` so a mailbox change
 * happens in exactly one place.
 *
 * The correct domain is tychosystem.com (singular — no trailing "s", and never
 * a truncated variant). Do not reintroduce any misspelled domain.
 */

export const CONTACT_DOMAIN = 'tychosystem.com'

/**
 * Named business addresses. Keys describe the role; values are the real
 * mailboxes/aliases on {@link CONTACT_DOMAIN}.
 */
export const emails = {
  /** Founder / primary mailbox. Also the destination for critical system alerts. */
  founder: 'jordhan@tychosystem.com',
  /** General contact and the default public enquiry address. */
  contact: 'contact@tychosystem.com',
  /** Friendly, top-of-funnel "say hello" address. */
  hello: 'hello@tychosystem.com',
  /** General information alias. */
  info: 'info@tychosystem.com',
  /** Client / customer support. */
  support: 'support@tychosystem.com',
  /** Billing, invoices and refunds. */
  billing: 'billing@tychosystem.com',
  /** Privacy, data-protection and GDPR rights requests. */
  privacy: 'privacy@tychosystem.com',
  /** Automated resource / lead-magnet delivery (transactional sender). */
  resources: 'resources@tychosystem.com',
  /** Partnership and collaboration enquiries. */
  partners: 'partners@tychosystem.com',
} as const

export type ContactEmailKey = keyof typeof emails
export type ContactEmail = (typeof emails)[ContactEmailKey]

/**
 * Prefilled subject lines for common enquiry types. Used to build accessible
 * `mailto:` links so a click opens a pre-labelled message.
 */
export const emailSubjects = {
  support: 'Support request',
  privacy: 'Privacy request',
  partnership: 'Partnership enquiry',
  billing: 'Billing enquiry',
} as const

export type EmailSubjectKey = keyof typeof emailSubjects

/**
 * Build a `mailto:` href, URL-encoding the optional prefilled subject so it is
 * safe to drop straight into an anchor's `href`.
 */
export function mailto(address: ContactEmail | string, subject?: string): string {
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`
}
