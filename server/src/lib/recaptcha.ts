/**
 * Shared reCAPTCHA v3 verification. Used by every public form route so the
 * policy (score threshold, expected action, failure handling) lives in one
 * place. The secret stays server-side.
 *
 * Env: RECAPTCHA_SECRET_KEY. When unset, verification is skipped (dev/demo) and
 * requests are allowed through — pair with the public VITE_RECAPTCHA_SITE_KEY.
 *
 * Policy:
 * - no secret configured  → skipped, allowed (dev)
 * - secret set, no token  → rejected (fail closed; a real user's browser sends one)
 * - success + action ok + score ≥ threshold → allowed
 * - Google endpoint unreachable → allowed but flagged (fail open; don't drop
 *   legitimate leads during a reCAPTCHA outage)
 */

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const DEFAULT_MIN_SCORE = 0.5

export type RecaptchaVerification = {
  /** Whether the request should be allowed to proceed. */
  ok: boolean
  /** reCAPTCHA risk score (0.0–1.0); 0 when unknown. */
  score: number
  /** True when verification did not actually run (no secret, or endpoint down). */
  skipped: boolean
  /** Machine-readable reason for logging (never surfaced to the client verbatim). */
  reason?: string
}

type VerifyOptions = {
  /** Require the token to carry this action name (v3 binds a token to an action). */
  expectedAction?: string
  /** Minimum acceptable score. Defaults to 0.5. */
  minScore?: number
  /** Injectable fetch for testing. */
  fetchImpl?: typeof fetch
}

type SiteVerifyResponse = {
  success?: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

export async function verifyRecaptcha(
  token: string | undefined,
  options: VerifyOptions = {}
): Promise<RecaptchaVerification> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return { ok: true, score: 1, skipped: true, reason: 'not_configured' }
  if (!token) return { ok: false, score: 0, skipped: false, reason: 'missing_token' }

  const doFetch = options.fetchImpl ?? fetch
  let data: SiteVerifyResponse
  try {
    const res = await doFetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    })
    data = (await res.json()) as SiteVerifyResponse
  } catch {
    // Fail open: our server could not reach Google. Don't block real users.
    return { ok: true, score: 0, skipped: true, reason: 'verify_unreachable' }
  }

  const score = typeof data.score === 'number' ? data.score : 0
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE

  if (!data.success) return { ok: false, score, skipped: false, reason: 'failed' }
  if (options.expectedAction && data.action && data.action !== options.expectedAction) {
    return { ok: false, score, skipped: false, reason: 'action_mismatch' }
  }
  if (score < minScore) return { ok: false, score, skipped: false, reason: 'low_score' }
  return { ok: true, score, skipped: false }
}
