import { describe, it, expect, afterEach } from 'vitest'
import { verifyRecaptcha } from './recaptcha.js'

const ORIGINAL_SECRET = process.env.RECAPTCHA_SECRET_KEY

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.RECAPTCHA_SECRET_KEY
  else process.env.RECAPTCHA_SECRET_KEY = ORIGINAL_SECRET
})

/** Minimal fetch stub returning a siteverify-shaped JSON body. */
function fakeFetch(payload: Record<string, unknown>): typeof fetch {
  return (async () => ({ json: async () => payload })) as unknown as typeof fetch
}

describe('verifyRecaptcha', () => {
  it('skips (allows) when no secret is configured', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY
    const result = await verifyRecaptcha('any-token')
    expect(result).toMatchObject({ ok: true, skipped: true, reason: 'not_configured' })
  })

  it('rejects when configured but no token is supplied', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const result = await verifyRecaptcha(undefined)
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('missing_token')
  })

  it('allows a successful high-score token with a matching action', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const result = await verifyRecaptcha('tok', {
      expectedAction: 'lead_magnet',
      fetchImpl: fakeFetch({ success: true, score: 0.9, action: 'lead_magnet' }),
    })
    expect(result).toMatchObject({ ok: true, score: 0.9, skipped: false })
  })

  it('rejects a low score', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const result = await verifyRecaptcha('tok', {
      fetchImpl: fakeFetch({ success: true, score: 0.1 }),
    })
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('low_score')
  })

  it('rejects an action mismatch', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const result = await verifyRecaptcha('tok', {
      expectedAction: 'lead_magnet',
      fetchImpl: fakeFetch({ success: true, score: 0.9, action: 'website_check' }),
    })
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('action_mismatch')
  })

  it('rejects an unsuccessful verification', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const result = await verifyRecaptcha('tok', {
      fetchImpl: fakeFetch({ success: false, 'error-codes': ['invalid-input-response'] }),
    })
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('failed')
  })

  it('honours a custom minimum score', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const result = await verifyRecaptcha('tok', {
      minScore: 0.3,
      fetchImpl: fakeFetch({ success: true, score: 0.4 }),
    })
    expect(result.ok).toBe(true)
  })

  it('fails open (allows, flagged) when the verify endpoint is unreachable', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret'
    const throwing = (async () => {
      throw new Error('network down')
    }) as unknown as typeof fetch
    const result = await verifyRecaptcha('tok', { fetchImpl: throwing })
    expect(result).toMatchObject({ ok: true, skipped: true, reason: 'verify_unreachable' })
  })
})
