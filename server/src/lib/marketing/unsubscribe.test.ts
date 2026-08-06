import { describe, it, expect, vi } from 'vitest'
import { processUnsubscribe, verifyUnsubscribeToken } from './unsubscribe.js'
import type { UnsubscribeDeps } from './unsubscribe.js'
import { sendMarketingEmail } from './send.js'
import { createUnsubscribeTokenService } from './tokens.js'
import { hashEmail } from './subscriptions.js'
import type {
  MarketingSubscriptionStore,
  SubscriptionRecord,
  SubscribeInput,
  UnsubscribeInput,
} from './subscriptions.js'
import type { CrmClient } from '../hubspot.js'
import { HubSpotError } from '../hubspot.js'
import type { TransactionalEmail, TransactionalEmailProvider } from '../email.js'

const SECRET = 'test-secret-value-long-enough-for-the-check'
const tokens = createUnsubscribeTokenService(SECRET)

/** In-memory store keyed the same way the Supabase table is. */
function makeStore(seed: Partial<SubscriptionRecord>[] = []) {
  const rows = new Map<string, SubscriptionRecord>()
  for (const row of seed) {
    rows.set(row.email_hash as string, {
      email_hash: row.email_hash as string,
      status: row.status ?? 'subscribed',
      crm_contact_id: row.crm_contact_id ?? null,
      consent_source: row.consent_source ?? null,
      consent_text_version: row.consent_text_version ?? null,
      subscribed_at: row.subscribed_at ?? null,
      unsubscribed_at: row.unsubscribed_at ?? null,
      unsubscribe_source: row.unsubscribe_source ?? null,
      crm_sync_status: row.crm_sync_status ?? 'skipped',
    })
  }

  const store: MarketingSubscriptionStore & { rows: Map<string, SubscriptionRecord> } = {
    rows,
    async get(emailHash: string) {
      return rows.get(emailHash) ?? null
    },
    async subscribe(input: SubscribeInput) {
      rows.set(input.emailHash, {
        ...(rows.get(input.emailHash) ?? ({} as SubscriptionRecord)),
        email_hash: input.emailHash,
        status: 'subscribed',
        crm_contact_id: input.crmContactId ?? null,
        consent_source: input.consentSource,
        consent_text_version: input.consentTextVersion ?? null,
        subscribed_at: input.at.toISOString(),
        unsubscribed_at: null,
        unsubscribe_source: null,
        crm_sync_status: 'skipped',
      })
    },
    async unsubscribe(input: UnsubscribeInput) {
      rows.set(input.emailHash, {
        ...(rows.get(input.emailHash) ?? ({} as SubscriptionRecord)),
        email_hash: input.emailHash,
        status: 'unsubscribed',
        unsubscribed_at: input.at.toISOString(),
        unsubscribe_source: input.source,
        crm_sync_status: input.crmSyncStatus,
      })
    },
  }

  return store
}

function makeCrm(overrides: Partial<CrmClient> = {}): CrmClient {
  return {
    name: 'mock-crm',
    upsertContactByEmail: vi.fn().mockResolvedValue({ contactId: 'c-1', created: false }),
    upsertCompanyAndAssociate: vi.fn().mockResolvedValue(undefined),
    setMarketingOptOut: vi.fn().mockResolvedValue({ contactFound: true }),
    ...overrides,
  }
}

function makeDeps(overrides: Partial<UnsubscribeDeps> = {}): UnsubscribeDeps {
  return {
    tokens,
    subscriptions: makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }]),
    crm: makeCrm(),
    log: vi.fn(),
    ...overrides,
  }
}

describe('processUnsubscribe', () => {
  it('unsubscribes a contact with a valid token', async () => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const deps = makeDeps({ subscriptions: store })

    const result = await processUnsubscribe(deps, tokens.create('ada@example.com'), 'email_link')

    expect(result).toMatchObject({ ok: true, status: 200, alreadyUnsubscribed: false })
    expect(store.rows.get(hashEmail('ada@example.com'))).toMatchObject({
      status: 'unsubscribed',
      unsubscribe_source: 'email_link',
      crm_sync_status: 'synced',
    })
  })

  it('is idempotent — repeating it still succeeds and raises no error', async () => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const deps = makeDeps({ subscriptions: store })
    const token = tokens.create('ada@example.com')

    const first = await processUnsubscribe(deps, token, 'email_link')
    const second = await processUnsubscribe(deps, token, 'email_link')
    const third = await processUnsubscribe(deps, token, 'one_click_header')

    expect(first).toMatchObject({ ok: true, alreadyUnsubscribed: false })
    expect(second).toMatchObject({ ok: true, alreadyUnsubscribed: true })
    expect(third).toMatchObject({ ok: true, alreadyUnsubscribed: true })
    expect(store.rows.get(hashEmail('ada@example.com'))?.status).toBe('unsubscribed')
  })

  it('works for an address it has never seen, without revealing that', async () => {
    const store = makeStore()
    const deps = makeDeps({ subscriptions: store })

    const known = await processUnsubscribe(
      makeDeps({
        subscriptions: makeStore([
          { email_hash: hashEmail('ada@example.com'), status: 'subscribed' },
        ]),
      }),
      tokens.create('ada@example.com'),
      'email_link'
    )
    const unknown = await processUnsubscribe(
      deps,
      tokens.create('nobody@example.com'),
      'email_link'
    )

    // Identical response shape: nothing distinguishes a known address from an
    // unknown one.
    expect(unknown).toEqual(known)
  })

  it('records the opt-out even when the CRM sync fails, and flags it for retry', async () => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const deps = makeDeps({
      subscriptions: store,
      crm: makeCrm({
        setMarketingOptOut: vi.fn().mockRejectedValue(new HubSpotError('boom', 500)),
      }),
    })

    const result = await processUnsubscribe(deps, tokens.create('ada@example.com'), 'email_link')

    expect(result).toMatchObject({ ok: true, crmSynced: false })
    expect(store.rows.get(hashEmail('ada@example.com'))).toMatchObject({
      status: 'unsubscribed',
      crm_sync_status: 'pending',
    })
  })

  it('reports failure when the local opt-out cannot be written', async () => {
    const store = makeStore()
    store.unsubscribe = vi.fn().mockRejectedValue(new Error('db down'))

    const result = await processUnsubscribe(
      makeDeps({ subscriptions: store }),
      tokens.create('ada@example.com'),
      'email_link'
    )

    expect(result).toMatchObject({ ok: false, status: 503 })
  })

  it.each([
    ['a missing token', undefined],
    ['a malformed token', 'garbage'],
    ['a token from another secret', createUnsubscribeTokenService('another-secret-of-sufficient-length').create('ada@example.com')],
  ])('rejects %s without touching any state', async (_label, token) => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const crm = makeCrm()

    const result = await processUnsubscribe(
      makeDeps({ subscriptions: store, crm }),
      token,
      'email_link'
    )

    expect(result).toMatchObject({ ok: false, status: 400 })
    expect(store.rows.get(hashEmail('ada@example.com'))?.status).toBe('subscribed')
    expect(crm.setMarketingOptOut).not.toHaveBeenCalled()
  })

  it('gives the same message for every kind of invalid token', async () => {
    const deps = makeDeps()
    const a = await processUnsubscribe(deps, 'garbage', 'email_link')
    const b = await processUnsubscribe(deps, 'u1.a.b.c', 'email_link')

    expect(a).toEqual(b)
  })

  it('never logs the address or the token', async () => {
    const log = vi.fn()
    const token = tokens.create('ada@example.com')

    await processUnsubscribe(makeDeps({ log }), token, 'email_link')
    await processUnsubscribe(makeDeps({ log }), 'garbage-token', 'email_link')

    const logged = JSON.stringify(log.mock.calls)
    expect(logged).not.toContain('ada@example.com')
    expect(logged).not.toContain(token)
    expect(logged).not.toContain('garbage-token')
    // The hash is fine — it is what the tables are keyed on.
    expect(logged).toContain(hashEmail('ada@example.com'))
  })
})

describe('verifyUnsubscribeToken', () => {
  it('validates without changing anything, so a prefetching gateway cannot unsubscribe', async () => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const deps = makeDeps({ subscriptions: store })

    expect(verifyUnsubscribeToken(deps, tokens.create('ada@example.com'))).toEqual({ ok: true })
    expect(verifyUnsubscribeToken(deps, 'garbage')).toEqual({ ok: false })
    expect(store.rows.get(hashEmail('ada@example.com'))?.status).toBe('subscribed')
  })
})

describe('unsubscribing is respected by later marketing sends', () => {
  function makeEmailProvider() {
    const sent: TransactionalEmail[] = []
    const provider: TransactionalEmailProvider = {
      name: 'mock-email',
      send: vi.fn(async (email: TransactionalEmail) => {
        sent.push(email)
      }),
    }
    return { provider, sent }
  }

  it('excludes an unsubscribed contact from a subsequent send', async () => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const { provider, sent } = makeEmailProvider()
    const sendDeps = {
      email: provider,
      tokens,
      subscriptions: store,
      siteUrl: 'https://tychosystem.com',
      log: vi.fn(),
    }

    const before = await sendMarketingEmail(sendDeps, {
      to: 'ada@example.com',
      subject: 'Business Systems Briefing',
      text: 'Hello.',
    })
    expect(before).toEqual({ sent: true })

    await processUnsubscribe(
      makeDeps({ subscriptions: store }),
      tokens.create('ada@example.com'),
      'email_link'
    )

    const after = await sendMarketingEmail(sendDeps, {
      to: 'ada@example.com',
      subject: 'Business Systems Briefing 2',
      text: 'Hello again.',
    })

    expect(after).toEqual({ sent: false, reason: 'unsubscribed' })
    expect(sent).toHaveLength(1)
  })

  it('leaves transactional sending untouched', async () => {
    const store = makeStore([{ email_hash: hashEmail('ada@example.com'), status: 'subscribed' }])
    const { provider, sent } = makeEmailProvider()

    await processUnsubscribe(
      makeDeps({ subscriptions: store }),
      tokens.create('ada@example.com'),
      'email_link'
    )

    // Transactional mail does not go through the marketing guard at all.
    await provider.send({
      to: 'ada@example.com',
      subject: 'Your AI Operations Pain Map',
      text: 'Here is the guide you asked for.',
    })

    expect(sent).toHaveLength(1)
    expect(sent[0].subject).toBe('Your AI Operations Pain Map')
  })
})
