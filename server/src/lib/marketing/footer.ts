import { emails } from '../../config/contact.js'

/**
 * The shared footer appended to every marketing email.
 *
 * Every marketing message gets this — it is applied by `sendMarketingEmail`
 * rather than by each template, so a new campaign cannot ship without an
 * unsubscribe link by forgetting to include it.
 *
 * Not used for transactional mail. A receipt, a contract or a password reset
 * must not offer to unsubscribe from something the recipient cannot opt out of.
 */

export type MarketingFooterInput = {
  /** Absolute, per-recipient unsubscribe URL (opaque token, no address). */
  unsubscribeUrl: string
  /** Public site origin, no trailing slash. */
  siteUrl: string
}

export const MARKETING_FOOTER_REASON =
  'You are receiving this email because you subscribed to updates from Tycho Systems. You can unsubscribe at any time.'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildMarketingFooterText({ unsubscribeUrl, siteUrl }: MarketingFooterInput): string {
  return `—

Tycho Systems
${MARKETING_FOOTER_REASON}

Unsubscribe: ${unsubscribeUrl}
Privacy policy: ${siteUrl}/privacy
Contact: ${emails.contact}`
}

export function buildMarketingFooterHtml({ unsubscribeUrl, siteUrl }: MarketingFooterInput): string {
  const unsubscribe = escapeHtml(unsubscribeUrl)
  const privacy = escapeHtml(`${siteUrl}/privacy`)

  return `<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12.5px;line-height:1.6;color:#64748b;">
  <p style="margin:0 0 8px;"><strong style="color:#1f2a44;">Tycho Systems</strong></p>
  <p style="margin:0 0 12px;">${escapeHtml(MARKETING_FOOTER_REASON)}</p>
  <p style="margin:0;">
    <a href="${unsubscribe}" style="color:#3C6FD6;text-decoration:underline;">Unsubscribe</a>
    &nbsp;·&nbsp;
    <a href="${privacy}" style="color:#3C6FD6;text-decoration:underline;">Privacy policy</a>
    &nbsp;·&nbsp;
    <a href="mailto:${escapeHtml(emails.contact)}" style="color:#3C6FD6;text-decoration:underline;">${escapeHtml(emails.contact)}</a>
  </p>
</div>`
}

/**
 * RFC 2369 / RFC 8058 headers, so mail clients can offer their own unsubscribe
 * control next to the sender name.
 *
 * `List-Unsubscribe-Post` promises the POST endpoint acts without further
 * confirmation, which is why the one-click route is a *separate* endpoint from
 * the page: a GET must never change state, or a link-scanning mail gateway
 * would silently unsubscribe people. The visible footer link is still required
 * and is never replaced by these headers.
 */
export function buildListUnsubscribeHeaders(oneClickUrl: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${oneClickUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}
