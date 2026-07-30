/**
 * Server-side business-email configuration and notification routing.
 *
 * This mirrors the address book in `src/config/contact.ts` (the two are kept
 * in sync by a test) and adds the server-authoritative routing table that
 * decides where internal notifications go. The BROWSER never sees this file:
 * destination addresses and routing logic stay on the server so a form cannot
 * choose (or reveal) where its notification is delivered.
 *
 * Do not hard-code production environment values here. Transactional sender /
 * reply-to addresses are read from the environment in `src/lib/email.ts`; the
 * recommended production values are documented in `server/.env.example`.
 */

export const CONTACT_DOMAIN = 'tychosystem.com'

/** Named business addresses — must match `src/config/contact.ts`. */
export const emails = {
  founder: 'jordhan@tychosystem.com',
  contact: 'contact@tychosystem.com',
  hello: 'hello@tychosystem.com',
  info: 'info@tychosystem.com',
  support: 'support@tychosystem.com',
  billing: 'billing@tychosystem.com',
  privacy: 'privacy@tychosystem.com',
  resources: 'resources@tychosystem.com',
  partners: 'partners@tychosystem.com',
} as const

export type ContactEmailKey = keyof typeof emails

/**
 * Categories of internal notification the server may raise. The submitting
 * client may hint at a category, but the server alone maps a category to an
 * address — a request can never supply its own destination.
 */
export type NotificationCategory =
  | 'general_contact'
  | 'workflow_audit'
  | 'support'
  | 'billing'
  | 'privacy'
  | 'partnerships'
  | 'pdf_delivery_failure'
  | 'critical_alert'

/** The single source of truth for where each notification category is routed. */
export const notificationRecipients: Record<NotificationCategory, string> = {
  general_contact: emails.contact,
  workflow_audit: emails.contact,
  support: emails.support,
  billing: emails.billing,
  privacy: emails.privacy,
  partnerships: emails.partners,
  pdf_delivery_failure: emails.support,
  critical_alert: emails.founder,
}

/**
 * Resolve the destination for a notification category. Unknown or missing
 * categories fall back to the general contact mailbox so a notification is
 * never silently dropped or misrouted to an internal-only address.
 */
export function resolveNotificationRecipient(category: string | undefined): string {
  if (category && category in notificationRecipients) {
    return notificationRecipients[category as NotificationCategory]
  }
  return emails.contact
}

/**
 * Map a public form's `source`/`category` hint to a notification category.
 * Centralised so every form route classifies consistently, server-side.
 */
export function categoryForFormSource(source: string | undefined): NotificationCategory {
  switch (source) {
    case 'strategy-call':
    case 'workflow-audit':
    case 'website-check':
      return 'workflow_audit'
    case 'support':
      return 'support'
    case 'billing':
      return 'billing'
    case 'privacy':
      return 'privacy'
    case 'partnership':
    case 'partners':
      return 'partnerships'
    default:
      return 'general_contact'
  }
}
