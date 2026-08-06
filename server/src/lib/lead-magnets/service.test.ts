import { describe, it, expect, vi } from 'vitest'
import { processLeadMagnetSubscription, hashEmail } from './service.js'
import type { LeadMagnetDeps, LeadMagnetRequestRecord } from './service.js'
import { HubSpotError } from '../hubspot.js'
import type { CrmClient } from '../hubspot.js'
import type { TransactionalEmailProvider } from '../email.js'
import type { MarketingSubscriptionStore } from '../marketing/subscriptions.js'

const validBody = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  companyName: 'Analytical Engines Ltd',
  roleCategory: 'ceo_founder',
  teamSize: '6_10',
  primaryBusinessPain: 'slow_lead_response',
  hoursLostPerWeek: '5_10',
  requestedResource: 'ai_operations_pain_map',
  marketingConsent: true,
  consentTextVersion: '2026-07-lead-magnet-v1',
  source: { platform: 'linkedin', campaign: 'linkedin_ceo_operations', utmSource: 'linkedin' },
}

function makeCrm(overrides: Partial<CrmClient> = {}): CrmClient {
  return {
    name: 'mock-crm',
    upsertContactByEmail: vi.fn().mockResolvedValue({ contactId: 'c-1', created: true }),
    upsertCompanyAndAssociate: vi.fn().mockResolvedValue(undefined),
    setMarketingOptOut: vi.fn().mockResolvedValue({ contactFound: true }),
    ...overrides,
  }
}

function makeEmail(overrides: Partial<TransactionalEmailProvider> = {}): TransactionalEmailProvider {
  return {
    name: 'mock-email',
    send: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function makeDeps(overrides: Partial<LeadMagnetDeps> = {}): LeadMagnetDeps & {
  records: LeadMagnetRequestRecord[]
} {
  const records: LeadMagnetRequestRecord[] = []
  return {
    crm: makeCrm(),
    email: makeEmail(),
    store: {
      upsertRequest: vi.fn().mockImplementation(async (r: LeadMagnetRequestRecord) => {
        const i = records.findIndex(
          (x) => x.email_hash === r.email_hash && x.requested_resource === r.requested_resource
        )
        if (i >= 0) records[i] = r
        else records.push(r)
      }),
    },
    siteUrl: 'https://tychosystem.com',
    log: vi.fn(),
    records,
    ...overrides,
  }
}

describe('processLeadMagnetSubscription', () => {
  it('handles the happy path end to end (HubSpot success)', async () => {
    const deps = makeDeps()
    const result = await processLeadMagnetSubscription(deps, validBody)

    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.body.ok).toBe(true)
      expect(result.body.audienceSegment).toBe('business_leader')
      expect(result.body.deliveredResource.slug).toBe('ai_operations_pain_map')
      expect(result.body.deliveredResource.downloadUrl).toBe(
        'https://tychosystem.com/downloads/tycho-ai-operations-pain-map.pdf'
      )
      expect(result.body.marketingEnrolled).toBe(true)
      expect(result.body.redirectUrl).toBe('/thank-you/business-leader')
      expect(result.body.warnings).toBeUndefined()
    }

    expect(deps.crm!.upsertContactByEmail).toHaveBeenCalledWith(
      'ada@example.com',
      expect.objectContaining({
        tycho_audience_segment: 'business_leader',
        tycho_marketing_consent: 'true',
        tycho_consent_text_version: '2026-07-lead-magnet-v1',
        tycho_source_campaign: 'linkedin_ceo_operations',
      })
    )
    expect(deps.email!.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'ada@example.com', subject: 'Your AI Operations Pain Map' })
    )
    expect(deps.records).toHaveLength(1)
    expect(deps.records[0]).toMatchObject({
      crm_status: 'synced',
      email_status: 'sent',
      marketing_consent: true,
      audience_segment: 'business_leader',
    })
  })

  it('records consent=false without enrolling in marketing, and still delivers', async () => {
    const deps = makeDeps()
    const result = await processLeadMagnetSubscription(deps, {
      ...validBody,
      marketingConsent: false,
    })
    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.body.marketingEnrolled).toBe(false)
      expect(result.body.deliveredResource.slug).toBe('ai_operations_pain_map')
    }
    expect(deps.crm!.upsertContactByEmail).toHaveBeenCalledWith(
      'ada@example.com',
      expect.objectContaining({ tycho_marketing_consent: 'false' })
    )
    // Delivery email still sent — never conditioned on marketing consent.
    expect(deps.email!.send).toHaveBeenCalled()
  })

  it('updates the existing contact on repeat submission (HubSpot update path)', async () => {
    const crm = makeCrm({
      upsertContactByEmail: vi.fn().mockResolvedValue({ contactId: 'c-1', created: false }),
    })
    const deps = makeDeps({ crm })

    await processLeadMagnetSubscription(deps, validBody)
    const second = await processLeadMagnetSubscription(deps, validBody)

    expect(second.status).toBe(200)
    expect(crm.upsertContactByEmail).toHaveBeenCalledTimes(2)
    // Idempotent local record: still one row for (email, resource).
    expect(deps.records).toHaveLength(1)
  })

  it('re-segments a repeat subscriber whose role changed', async () => {
    const deps = makeDeps()
    await processLeadMagnetSubscription(deps, {
      ...validBody,
      roleCategory: 'student_job_seeker',
      companyName: undefined,
      teamSize: undefined,
      primaryBusinessPain: undefined,
      requestedResource: 'ai_dictionary',
    })
    expect(deps.records[0].audience_segment).toBe('ai_builder_learner')

    const promoted = await processLeadMagnetSubscription(deps, {
      ...validBody,
      requestedResource: 'ai_dictionary',
    })
    expect(promoted.status).toBe(200)
    if (promoted.status === 200) {
      expect(promoted.body.audienceSegment).toBe('business_leader')
      expect(promoted.body.deliveredResource.slug).toBe('ai_operations_pain_map')
    }
    expect(deps.records[0].audience_segment).toBe('business_leader')
  })

  it('fails loudly (502) when the configured CRM fails — no silent success', async () => {
    const crm = makeCrm({
      upsertContactByEmail: vi.fn().mockRejectedValue(new HubSpotError('boom', 500)),
    })
    const deps = makeDeps({ crm })
    const result = await processLeadMagnetSubscription(deps, validBody)

    expect(result.status).toBe(502)
    expect(result.body.ok).toBe(false)
    expect(deps.email!.send).not.toHaveBeenCalled()
  })

  it('propagates a rate-limited CRM error as a failure (retry handled inside the client)', async () => {
    const crm = makeCrm({
      upsertContactByEmail: vi.fn().mockRejectedValue(new HubSpotError('rate limited', 429)),
    })
    const deps = makeDeps({ crm })
    const result = await processLeadMagnetSubscription(deps, validBody)
    expect(result.status).toBe(502)
  })

  it('treats company association failure as a warning, not a failure', async () => {
    const crm = makeCrm({
      upsertCompanyAndAssociate: vi.fn().mockRejectedValue(new HubSpotError('assoc failed', 500)),
    })
    const deps = makeDeps({ crm })
    const result = await processLeadMagnetSubscription(deps, validBody)
    expect(result.status).toBe(200)
    if (result.status === 200) expect(result.body.warnings).toContain('company_association_failed')
  })

  it('continues with a warning when email delivery fails', async () => {
    const email = makeEmail({ send: vi.fn().mockRejectedValue(new Error('smtp down')) })
    const deps = makeDeps({ email })
    const result = await processLeadMagnetSubscription(deps, validBody)

    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.body.warnings).toContain('delivery_email_failed')
      expect(result.body.deliveredResource.downloadUrl).toBeTruthy()
    }
    expect(deps.records[0].email_status).toBe('failed')
  })

  it('continues with a warning when the database fails', async () => {
    const deps = makeDeps({
      store: { upsertRequest: vi.fn().mockRejectedValue(new Error('db down')) },
    })
    const result = await processLeadMagnetSubscription(deps, validBody)
    expect(result.status).toBe(200)
    if (result.status === 200) expect(result.body.warnings).toContain('audit_record_failed')
  })

  it('skips CRM and email gracefully when not configured', async () => {
    const deps = makeDeps({ crm: null, email: null })
    const result = await processLeadMagnetSubscription(deps, validBody)
    expect(result.status).toBe(200)
    expect(deps.records[0]).toMatchObject({ crm_status: 'skipped', email_status: 'skipped' })
  })

  it('rejects invalid input with 400 and touches no integrations', async () => {
    const deps = makeDeps()
    const result = await processLeadMagnetSubscription(deps, { firstName: 'Ada' })
    expect(result.status).toBe(400)
    expect(deps.crm!.upsertContactByEmail).not.toHaveBeenCalled()
    expect(deps.email!.send).not.toHaveBeenCalled()
  })

  it('sends the dictionary email for cross-delivered learners', async () => {
    const deps = makeDeps()
    const result = await processLeadMagnetSubscription(deps, {
      ...validBody,
      roleCategory: 'developer',
    })
    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.body.deliveredResource.slug).toBe('ai_dictionary')
      expect(result.body.redirectUrl).toBe('/thank-you/ai-dictionary')
    }
    expect(deps.email!.send).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Your Practical AI Dictionary' })
    )
  })
})

describe('hashEmail', () => {
  it('is stable and non-reversible-looking', () => {
    expect(hashEmail('ada@example.com')).toBe(hashEmail('ada@example.com'))
    expect(hashEmail('ada@example.com')).toMatch(/^[a-f0-9]{64}$/)
  })
})

describe('marketing subscription state', () => {
  function makeSubscriptions() {
    const calls: Array<{ kind: 'subscribe' | 'unsubscribe'; input: unknown }> = []
    const store: MarketingSubscriptionStore & { calls: typeof calls } = {
      calls,
      get: vi.fn().mockResolvedValue(null),
      subscribe: vi.fn(async (input) => {
        calls.push({ kind: 'subscribe', input })
      }),
      unsubscribe: vi.fn(async (input) => {
        calls.push({ kind: 'unsubscribe', input })
      }),
    }
    return store
  }

  it('records an opt-in when the marketing box is ticked', async () => {
    const subscriptions = makeSubscriptions()
    await processLeadMagnetSubscription(makeDeps({ subscriptions }), {
      ...validBody,
      marketingConsent: true,
    })

    expect(subscriptions.calls).toHaveLength(1)
    expect(subscriptions.calls[0].kind).toBe('subscribe')
    expect(subscriptions.calls[0].input).toMatchObject({
      emailHash: hashEmail('ada@example.com'),
      consentSource: 'lead_magnet:ai_operations_pain_map',
      consentTextVersion: '2026-07-lead-magnet-v1',
    })
  })

  it('does not subscribe someone who only wanted the guide', async () => {
    const subscriptions = makeSubscriptions()
    const result = await processLeadMagnetSubscription(makeDeps({ subscriptions }), {
      ...validBody,
      marketingConsent: false,
    })

    // The guide is still delivered — refusing marketing costs the visitor
    // nothing.
    expect(result.status).toBe(200)
    if (result.status === 200) expect(result.body.marketingEnrolled).toBe(false)

    expect(subscriptions.subscribe).not.toHaveBeenCalled()
    expect(subscriptions.calls[0]?.kind).toBe('unsubscribe')
  })

  it('only resubscribes on a fresh explicit opt-in, never on another form alone', async () => {
    const subscriptions = makeSubscriptions()
    const deps = makeDeps({ subscriptions })

    await processLeadMagnetSubscription(deps, { ...validBody, marketingConsent: true })
    // A later request for the other guide, box left unticked.
    await processLeadMagnetSubscription(deps, {
      ...validBody,
      requestedResource: 'ai_dictionary',
      marketingConsent: false,
    })

    expect(subscriptions.calls.map((c) => c.kind)).toEqual(['subscribe', 'unsubscribe'])

    // Ticking it again is a new explicit opt-in, and that does resubscribe.
    await processLeadMagnetSubscription(deps, { ...validBody, marketingConsent: true })
    expect(subscriptions.calls.map((c) => c.kind)).toEqual([
      'subscribe',
      'unsubscribe',
      'subscribe',
    ])
  })

  it('still delivers the guide when the subscription write fails', async () => {
    const subscriptions = makeSubscriptions()
    subscriptions.subscribe = vi.fn().mockRejectedValue(new Error('db down'))

    const result = await processLeadMagnetSubscription(makeDeps({ subscriptions }), {
      ...validBody,
      marketingConsent: true,
    })

    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.body.warnings).toContain('subscription_state_failed')
    }
  })
})
