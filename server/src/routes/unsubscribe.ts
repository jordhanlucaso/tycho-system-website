import { Router, urlencoded } from 'express'
import { supabase } from '../lib/supabase.js'
import { createCrmClientFromEnv } from '../lib/hubspot.js'
import { createSupabaseSubscriptionStore } from '../lib/marketing/subscriptions.js'
import { createUnsubscribeTokenServiceFromEnv } from '../lib/marketing/tokens.js'
import { processUnsubscribe, verifyUnsubscribeToken } from '../lib/marketing/unsubscribe.js'
import type { UnsubscribeDeps } from '../lib/marketing/unsubscribe.js'

export const unsubscribeRouter = Router()

/**
 * Unsubscribe endpoints.
 *
 * GET  /api/unsubscribe/verify   — is this token valid? Changes nothing.
 * POST /api/unsubscribe          — the confirmed action from the page.
 * POST /api/unsubscribe/one-click— RFC 8058 target for List-Unsubscribe-Post.
 *
 * No authentication: a recipient must be able to unsubscribe from an email
 * without an account. The token is the authorisation.
 *
 * Note there is no GET that unsubscribes. Mail security gateways prefetch
 * links, so a state-changing GET would opt people out without their knowledge.
 */

/** Structured logs with no personal data — addresses only ever appear hashed. */
const log: UnsubscribeDeps['log'] = (level, message, meta) => {
  const line = JSON.stringify({ level, message, ...meta })
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

function buildDeps(): UnsubscribeDeps {
  return {
    tokens: createUnsubscribeTokenServiceFromEnv(),
    subscriptions: createSupabaseSubscriptionStore(supabase),
    crm: createCrmClientFromEnv(),
    log,
  }
}

/** Accept `t` from either the query string or the body. */
function readToken(source: Record<string, unknown> | undefined): string | undefined {
  const value = source?.t ?? source?.token
  return typeof value === 'string' ? value : undefined
}

// GET /api/unsubscribe/verify?t=…
unsubscribeRouter.get('/verify', (req, res) => {
  const { ok } = verifyUnsubscribeToken(buildDeps(), readToken(req.query as Record<string, unknown>))
  // Same shape either way — nothing here reveals whether an address is known.
  res.status(200).json({ ok })
})

// POST /api/unsubscribe  { t }
unsubscribeRouter.post('/', async (req, res) => {
  try {
    const token =
      readToken(req.body as Record<string, unknown>) ??
      readToken(req.query as Record<string, unknown>)

    const result = await processUnsubscribe(buildDeps(), token, 'email_link')

    if (!result.ok) {
      res.status(result.status).json({ ok: false, error: result.error })
      return
    }

    res.status(200).json({ ok: true, alreadyUnsubscribed: result.alreadyUnsubscribed })
  } catch (err) {
    log('error', 'unsubscribe.unhandled_error', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' })
  }
})

/**
 * POST /api/unsubscribe/one-click?t=…
 *
 * RFC 8058. The mail client posts `List-Unsubscribe=One-Click` as
 * form-encoded data, so this route parses urlencoded bodies (the app-wide JSON
 * parser would not). It must act immediately, with no confirmation step, and
 * always answer 200 so the client does not surface an error to the recipient
 * for something they cannot act on.
 */
unsubscribeRouter.post('/one-click', urlencoded({ extended: false }), async (req, res) => {
  try {
    const token =
      readToken(req.query as Record<string, unknown>) ??
      readToken(req.body as Record<string, unknown>)

    await processUnsubscribe(buildDeps(), token, 'one_click_header')
  } catch (err) {
    log('error', 'unsubscribe.one_click_unhandled_error', {
      error: err instanceof Error ? err.message : 'unknown',
    })
  }

  res.status(200).json({ ok: true })
})
