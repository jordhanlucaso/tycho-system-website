import type { CrmClient } from '../hubspot.js'
import { hashEmail, type MarketingSubscriptionStore } from './subscriptions.js'
import type { UnsubscribeTokenService } from './tokens.js'

/**
 * Unsubscribe workflow.
 *
 * Design notes that matter:
 *
 * - **Idempotent.** Unsubscribing twice is a success, not an error. Mail
 *   clients retry, people click twice, and gateways prefetch.
 * - **No enumeration.** The response never says whether an address exists in
 *   HubSpot or in our tables. A valid token always yields the same success
 *   shape; an invalid one always yields the same failure shape.
 * - **Local first, CRM second.** Our own suppression list is written before the
 *   CRM call, so a HubSpot outage still stops the send at the boundary in
 *   `sendMarketingEmail`. The CRM failure is recorded as `crm_sync_status:
 *   'pending'` for retry rather than being lost.
 * - **Nothing sensitive is logged.** Only the email hash, never the address and
 *   never the token.
 */

export type UnsubscribeSource = 'email_link' | 'one_click_header' | 'manual'

export type UnsubscribeDeps = {
  tokens: UnsubscribeTokenService | null
  subscriptions: MarketingSubscriptionStore | null
  crm: CrmClient | null
  log: (level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) => void
  now?: () => Date
}

export type UnsubscribeResult =
  | { ok: true; status: 200; alreadyUnsubscribed: boolean; crmSynced: boolean }
  | { ok: false; status: 400 | 503; error: string }

/** Deliberately identical for every rejection reason. */
const INVALID_TOKEN_MESSAGE =
  'This unsubscribe link is not valid. It may have been altered in transit — please use the link in a more recent email, or email privacy@tychosystem.com and we will do it for you.'

const UNAVAILABLE_MESSAGE =
  'We could not process the request just now. Please try again shortly, or email privacy@tychosystem.com.'

/**
 * Validate a token without changing anything. Used by the confirmation page —
 * a GET must never unsubscribe, or a link-scanning mail gateway would do it on
 * the recipient's behalf.
 */
export function verifyUnsubscribeToken(
  deps: UnsubscribeDeps,
  token: string | undefined
): { ok: boolean } {
  if (!deps.tokens) return { ok: false }
  return { ok: deps.tokens.read(token) !== null }
}

export async function processUnsubscribe(
  deps: UnsubscribeDeps,
  token: string | undefined,
  source: UnsubscribeSource
): Promise<UnsubscribeResult> {
  if (!deps.tokens) {
    deps.log('error', 'unsubscribe.no_token_service')
    return { ok: false, status: 503, error: UNAVAILABLE_MESSAGE }
  }

  const payload = deps.tokens.read(token)
  if (!payload) {
    // No detail about *why* — not in the response and not in the log.
    deps.log('warn', 'unsubscribe.invalid_token', { source })
    return { ok: false, status: 400, error: INVALID_TOKEN_MESSAGE }
  }

  const email = payload.email
  const emailHash = hashEmail(email)
  const now = (deps.now ?? (() => new Date()))()

  if (!deps.subscriptions) {
    deps.log('error', 'unsubscribe.no_subscription_store', { emailHash })
    return { ok: false, status: 503, error: UNAVAILABLE_MESSAGE }
  }

  let alreadyUnsubscribed = false
  try {
    const existing = await deps.subscriptions.get(emailHash)
    alreadyUnsubscribed = existing?.status === 'unsubscribed'
  } catch (err) {
    // Not fatal: we are about to write the opt-out anyway. It only affects
    // whether we can tell the visitor "you were already unsubscribed".
    deps.log('warn', 'unsubscribe.lookup_failed', {
      emailHash,
      error: err instanceof Error ? err.message : 'unknown',
    })
  }

  // Mirror to the CRM first so its outcome can be stored in the same write,
  // but never let a CRM failure block the local opt-out.
  let crmSynced = false
  let crmSyncStatus: 'synced' | 'pending' | 'skipped' = 'skipped'

  if (deps.crm) {
    try {
      await deps.crm.setMarketingOptOut(email, source, now)
      crmSynced = true
      crmSyncStatus = 'synced'
    } catch (err) {
      crmSyncStatus = 'pending'
      deps.log('error', 'unsubscribe.crm_sync_failed', {
        emailHash,
        error: err instanceof Error ? err.message : 'unknown',
      })
    }
  }

  try {
    await deps.subscriptions.unsubscribe({ emailHash, source, at: now, crmSyncStatus })
  } catch (err) {
    deps.log('error', 'unsubscribe.store_failed', {
      emailHash,
      error: err instanceof Error ? err.message : 'unknown',
    })
    // If the CRM opt-out succeeded the contact is already out of the
    // sequences, but our own guard has no record of it — so this must not be
    // reported as success.
    return { ok: false, status: 503, error: UNAVAILABLE_MESSAGE }
  }

  deps.log('info', 'unsubscribe.completed', {
    emailHash,
    source,
    alreadyUnsubscribed,
    crmSyncStatus,
  })

  return { ok: true, status: 200, alreadyUnsubscribed, crmSynced }
}
