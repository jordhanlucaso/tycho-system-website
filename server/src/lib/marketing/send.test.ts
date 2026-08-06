import { describe, it, expect, vi } from 'vitest'
import { sendMarketingEmail } from './send.js'
import type { MarketingSendDeps } from './send.js'
import { createUnsubscribeTokenService } from './tokens.js'
import { hashEmail } from './subscriptions.js'
import type { MarketingSubscriptionStore, SubscriptionRecord } from './subscriptions.js'
import type { TransactionalEmail, TransactionalEmailProvider } from '../email.js'

const SECRET = 'test-secret-value-long-enough-for-the-check'
const tokens = createUnsubscribeTokenService(SECRET)
const RECIPIENT = 'ada@example.com'

function makeStore(status: SubscriptionRecord['status'] | 'missing'): MarketingSubscriptionStore {
  return {
    async get(emailHash) {
      if (status === 'missing') return null
      return {
        email_hash: emailHash,
        status,
        crm_contact_id: null,
        consent_source: 'lead_magnet:ai_dictionary',
        consent_text_version: '2026-07-lead-magnet-v1',
        subscribed_at: '2026-07-01T00:00:00.000Z',
        unsubscribed_at: null,
        unsubscribe_source: null,
        crm_sync_status: 'synced',
      }
    },
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  }
}

function makeDeps(overrides: Partial<MarketingSendDeps> = {}) {
  const sent: TransactionalEmail[] = []
  const email: TransactionalEmailProvider = {
    name: 'mock-email',
    send: vi.fn(async (message: TransactionalEmail) => {
      sent.push(message)
    }),
  }

  const deps: MarketingSendDeps = {
    email,
    tokens,
    subscriptions: makeStore('subscribed'),
    siteUrl: 'https://tychosystem.com',
    log: vi.fn(),
    ...overrides,
  }

  return { deps, sent }
}

const message = {
  to: RECIPIENT,
  subject: 'The four signs a workflow is worth automating',
  text: 'High frequency, repeatable input, clear output, meaningful cost.',
  html: '<p>High frequency, repeatable input, clear output, meaningful cost.</p>',
}

describe('the marketing send guard', () => {
  it('sends to a subscribed contact', async () => {
    const { deps, sent } = makeDeps()

    expect(await sendMarketingEmail(deps, message)).toEqual({ sent: true })
    expect(sent).toHaveLength(1)
  })

  it('refuses an unsubscribed contact', async () => {
    const { deps, sent } = makeDeps({ subscriptions: makeStore('unsubscribed') })

    expect(await sendMarketingEmail(deps, message)).toEqual({ sent: false, reason: 'unsubscribed' })
    expect(sent).toHaveLength(0)
  })

  it('fails closed for an address that never opted in', async () => {
    const { deps, sent } = makeDeps({ subscriptions: makeStore('missing') })

    expect(await sendMarketingEmail(deps, message)).toEqual({ sent: false, reason: 'unsubscribed' })
    expect(sent).toHaveLength(0)
  })

  it('fails closed when the suppression list cannot be read', async () => {
    const subscriptions = makeStore('subscribed')
    subscriptions.get = vi.fn().mockRejectedValue(new Error('db down'))
    const { deps, sent } = makeDeps({ subscriptions })

    expect(await sendMarketingEmail(deps, message)).toEqual({
      sent: false,
      reason: 'suppression_lookup_failed',
    })
    expect(sent).toHaveLength(0)
  })

  it('refuses to send when no unsubscribe token can be produced', async () => {
    const { deps, sent } = makeDeps({ tokens: null })

    expect(await sendMarketingEmail(deps, message)).toEqual({
      sent: false,
      reason: 'no_token_service',
    })
    expect(sent).toHaveLength(0)
  })

  it('refuses to send when there is no suppression list to check against', async () => {
    const { deps, sent } = makeDeps({ subscriptions: null })

    expect(await sendMarketingEmail(deps, message)).toEqual({
      sent: false,
      reason: 'no_subscription_store',
    })
    expect(sent).toHaveLength(0)
  })

  it('checks suppression at send time, not when the audience was chosen', async () => {
    // The audience was built while this contact was subscribed; they opted out
    // before the send. The boundary check is what catches that.
    let status: SubscriptionRecord['status'] = 'subscribed'
    const subscriptions: MarketingSubscriptionStore = {
      async get(emailHash) {
        return {
          email_hash: emailHash,
          status,
          crm_contact_id: null,
          consent_source: null,
          consent_text_version: null,
          subscribed_at: null,
          unsubscribed_at: null,
          unsubscribe_source: null,
          crm_sync_status: 'synced',
        }
      },
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    }
    const { deps, sent } = makeDeps({ subscriptions })

    status = 'unsubscribed'

    expect(await sendMarketingEmail(deps, message)).toEqual({ sent: false, reason: 'unsubscribed' })
    expect(sent).toHaveLength(0)
  })

  it('does not log the recipient address', async () => {
    const log = vi.fn()
    const { deps } = makeDeps({ log, subscriptions: makeStore('unsubscribed') })

    await sendMarketingEmail(deps, message)

    const logged = JSON.stringify(log.mock.calls)
    expect(logged).not.toContain(RECIPIENT)
    expect(logged).toContain(hashEmail(RECIPIENT))
  })
})

describe('the marketing footer', () => {
  it('adds a visible unsubscribe link to both the text and HTML bodies', async () => {
    const { deps, sent } = makeDeps()
    await sendMarketingEmail(deps, message)

    const [email] = sent
    expect(email.text).toContain('Unsubscribe: https://tychosystem.com/unsubscribe?t=')
    expect(email.html).toContain('>Unsubscribe</a>')
    expect(email.html).toContain('https://tychosystem.com/unsubscribe?t=')
  })

  it('states why the recipient is getting the email, and links the privacy policy', async () => {
    const { deps, sent } = makeDeps()
    await sendMarketingEmail(deps, message)

    const [email] = sent
    expect(email.text).toContain('You are receiving this email because you subscribed to updates')
    expect(email.text).toContain('Tycho Systems')
    expect(email.text).toContain('https://tychosystem.com/privacy')
    expect(email.html).toContain('https://tychosystem.com/privacy')
  })

  it('keeps the original body intact', async () => {
    const { deps, sent } = makeDeps()
    await sendMarketingEmail(deps, message)

    expect(sent[0].text.startsWith(message.text)).toBe(true)
    expect(sent[0].html).toContain(message.html)
  })

  it('exposes neither the address nor an internal id in the unsubscribe URL', async () => {
    const { deps, sent } = makeDeps()
    await sendMarketingEmail(deps, message)

    const url = sent[0].text.match(/https:\/\/tychosystem\.com\/unsubscribe\?t=\S+/)?.[0] ?? ''
    expect(url).not.toBe('')
    expect(url).not.toContain('ada')
    expect(url).not.toContain('example.com')
    expect(url).not.toContain('%40')

    // And the token really does resolve back to the recipient server-side.
    const token = decodeURIComponent(url.split('t=')[1])
    expect(tokens.read(token)?.email).toBe(RECIPIENT)
  })
})

describe('one-click unsubscribe headers', () => {
  it('sets List-Unsubscribe and List-Unsubscribe-Post', async () => {
    const { deps, sent } = makeDeps()
    await sendMarketingEmail(deps, message)

    const headers = sent[0].headers ?? {}
    expect(headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click')
    expect(headers['List-Unsubscribe']).toMatch(
      /^<https:\/\/tychosystem\.com\/api\/unsubscribe\/one-click\?t=.+>$/
    )
  })

  it('points at the API origin when the API is on a different host', async () => {
    const { deps, sent } = makeDeps({ apiBaseUrl: 'https://api.tychosystem.com' })
    await sendMarketingEmail(deps, message)

    expect(sent[0].headers?.['List-Unsubscribe']).toContain(
      'https://api.tychosystem.com/api/unsubscribe/one-click?t='
    )
    // The visible footer link stays on the public site and is still required.
    expect(sent[0].text).toContain('https://tychosystem.com/unsubscribe?t=')
  })
})
