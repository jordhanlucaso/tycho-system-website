import type { TransactionalEmail, TransactionalEmailProvider } from '../email.js'
import {
  buildListUnsubscribeHeaders,
  buildMarketingFooterHtml,
  buildMarketingFooterText,
} from './footer.js'
import { hashEmail, isMarketable, type MarketingSubscriptionStore } from './subscriptions.js'
import { buildUnsubscribeUrl, type UnsubscribeTokenService } from './tokens.js'

/**
 * The single door every marketing email must go through.
 *
 * Suppression is checked **here**, immediately before handing the message to
 * the provider — not when the audience was selected. Audience lists go stale:
 * a campaign assembled on Monday and sent on Thursday would otherwise mail
 * everyone who opted out in between. Re-checking at the boundary makes that
 * impossible regardless of how the recipient list was built.
 *
 * It also guarantees the two things a marketing email cannot ship without:
 * the visible footer (unsubscribe + privacy + identity) and the one-click
 * unsubscribe headers.
 *
 * Transactional mail does not come through here. `deps.email.send` stays
 * available for receipts, contracts, password resets and the lead-magnet
 * delivery, none of which are affected by an opt-out.
 */

export type MarketingMessage = {
  to: string
  subject: string
  /** Body without a footer — one is always appended. */
  text: string
  html?: string
}

export type MarketingSendDeps = {
  email: TransactionalEmailProvider | null
  tokens: UnsubscribeTokenService | null
  subscriptions: MarketingSubscriptionStore | null
  /** Public site origin, no trailing slash. */
  siteUrl: string
  /** API origin for the one-click endpoint. Defaults to `siteUrl`. */
  apiBaseUrl?: string
  log: (level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) => void
  now?: () => Date
}

export type MarketingSendResult =
  | { sent: true }
  | {
      sent: false
      reason:
        | 'unsubscribed'
        | 'no_email_provider'
        | 'no_token_service'
        | 'no_subscription_store'
        | 'suppression_lookup_failed'
        | 'delivery_failed'
    }

/** Where a mail client's one-click POST goes. */
export function buildOneClickUnsubscribeUrl(apiBaseUrl: string, token: string): string {
  return `${apiBaseUrl.replace(/\/+$/, '')}/api/unsubscribe/one-click?t=${encodeURIComponent(token)}`
}

export async function sendMarketingEmail(
  deps: MarketingSendDeps,
  message: MarketingMessage
): Promise<MarketingSendResult> {
  const emailHash = hashEmail(message.to)

  if (!deps.email) {
    deps.log('warn', 'marketing.skipped_no_email_provider', { emailHash })
    return { sent: false, reason: 'no_email_provider' }
  }

  // Without tokens we cannot produce a working unsubscribe link, and an email
  // whose unsubscribe link does not work is worse than one not sent.
  if (!deps.tokens) {
    deps.log('error', 'marketing.blocked_no_token_service', { emailHash })
    return { sent: false, reason: 'no_token_service' }
  }

  // Without the suppression list we cannot prove the recipient still wants
  // this. Fail closed.
  if (!deps.subscriptions) {
    deps.log('error', 'marketing.blocked_no_subscription_store', { emailHash })
    return { sent: false, reason: 'no_subscription_store' }
  }

  let record
  try {
    record = await deps.subscriptions.get(emailHash)
  } catch (err) {
    deps.log('error', 'marketing.suppression_lookup_failed', {
      emailHash,
      error: err instanceof Error ? err.message : 'unknown',
    })
    // A database blip must not become an unwanted email.
    return { sent: false, reason: 'suppression_lookup_failed' }
  }

  if (!isMarketable(record)) {
    deps.log('info', 'marketing.suppressed', { emailHash, status: record?.status ?? 'unknown' })
    return { sent: false, reason: 'unsubscribed' }
  }

  const now = (deps.now ?? (() => new Date()))()
  const token = deps.tokens.create(message.to, now)
  const unsubscribeUrl = buildUnsubscribeUrl(deps.siteUrl, token)
  const oneClickUrl = buildOneClickUnsubscribeUrl(deps.apiBaseUrl ?? deps.siteUrl, token)

  const email: TransactionalEmail = {
    to: message.to,
    subject: message.subject,
    text: `${message.text}\n\n${buildMarketingFooterText({ unsubscribeUrl, siteUrl: deps.siteUrl })}`,
    ...(message.html
      ? { html: `${message.html}\n${buildMarketingFooterHtml({ unsubscribeUrl, siteUrl: deps.siteUrl })}` }
      : {}),
    headers: buildListUnsubscribeHeaders(oneClickUrl),
  }

  try {
    await deps.email.send(email)
  } catch (err) {
    deps.log('error', 'marketing.delivery_failed', {
      emailHash,
      error: err instanceof Error ? err.message : 'unknown',
    })
    return { sent: false, reason: 'delivery_failed' }
  }

  deps.log('info', 'marketing.sent', { emailHash })
  return { sent: true }
}
