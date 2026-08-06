/**
 * Minimal HubSpot CRM client for the lead-magnet funnel. Fetch-based (no SDK),
 * Contacts + Companies only, no custom objects. The private-app token stays
 * server-side.
 *
 * Env: HUBSPOT_PRIVATE_APP_TOKEN (unset = CRM disabled, dev/demo mode).
 * Required scopes: crm.objects.contacts.read/write,
 * crm.objects.companies.read/write.
 */

const HUBSPOT_BASE = 'https://api.hubapi.com'

export class HubSpotError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'HubSpotError'
  }
}

export type HubSpotContactProperties = Record<string, string>

export type UpsertContactResult = {
  contactId: string
  created: boolean
}

export type MarketingOptOutResult = {
  /** False when no contact exists for the address — still a success. */
  contactFound: boolean
}

export interface CrmClient {
  readonly name: string
  upsertContactByEmail(email: string, properties: HubSpotContactProperties): Promise<UpsertContactResult>
  upsertCompanyAndAssociate(contactId: string, companyName: string): Promise<void>
  /**
   * Withdraw marketing consent for an address. Idempotent, and a no-op when
   * the CRM has never seen the address.
   */
  setMarketingOptOut(email: string, source: string, at: Date): Promise<MarketingOptOutResult>
}

export class HubSpotClient implements CrmClient {
  readonly name = 'hubspot'

  constructor(private readonly token: string, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request(path: string, init: RequestInit, retried = false): Promise<Response> {
    const res = await this.fetchImpl(`${HUBSPOT_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    })

    // One retry on rate limit, honouring Retry-After when present.
    if (res.status === 429 && !retried) {
      const retryAfter = Number(res.headers.get('Retry-After')) || 1
      await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 10) * 1000))
      return this.request(path, init, true)
    }

    return res
  }

  private async findContactIdByEmail(email: string): Promise<string | null> {
    const res = await this.request('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
          },
        ],
        properties: ['email'],
        limit: 1,
      }),
    })

    if (!res.ok) throw new HubSpotError(`Contact search failed (${res.status})`, res.status)
    const data = (await res.json()) as { results?: Array<{ id: string }> }
    return data.results?.[0]?.id ?? null
  }

  /** One CRM contact per email address: update when it exists, create when not. */
  async upsertContactByEmail(
    email: string,
    properties: HubSpotContactProperties
  ): Promise<UpsertContactResult> {
    const existingId = await this.findContactIdByEmail(email)

    if (existingId) {
      const res = await this.request(`/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      })
      if (!res.ok) throw new HubSpotError(`Contact update failed (${res.status})`, res.status)
      return { contactId: existingId, created: false }
    }

    const res = await this.request('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties: { ...properties, email } }),
    })
    if (res.status === 409) {
      // Race: created between search and create — fall back to update.
      const raceId = await this.findContactIdByEmail(email)
      if (raceId) {
        const patch = await this.request(`/crm/v3/objects/contacts/${raceId}`, {
          method: 'PATCH',
          body: JSON.stringify({ properties }),
        })
        if (!patch.ok) throw new HubSpotError(`Contact update failed (${patch.status})`, patch.status)
        return { contactId: raceId, created: false }
      }
    }
    if (!res.ok) throw new HubSpotError(`Contact create failed (${res.status})`, res.status)
    const data = (await res.json()) as { id: string }
    return { contactId: data.id, created: true }
  }

  /**
   * Mark a contact as opted out of marketing.
   *
   * Two layers, because they do different jobs:
   * 1. `tycho_marketing_consent = 'false'` — this is what the nurture active
   *    lists filter on (see docs/email-sequences.md), so clearing it is what
   *    actually removes the contact from the sequences.
   * 2. HubSpot's own subscription opt-out, when HUBSPOT_MARKETING_SUBSCRIPTION_ID
   *    is configured. That is portal-level and applies to any HubSpot marketing
   *    email, including ones sent outside these workflows.
   *
   * Layer 2 is optional because the subscription type id is portal-specific and
   * cannot be inferred from this repository. Layer 1 alone already stops the
   * documented sequences.
   */
  async setMarketingOptOut(email: string, source: string, at: Date): Promise<MarketingOptOutResult> {
    const contactId = await this.findContactIdByEmail(email)

    if (contactId) {
      const res = await this.request(`/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          properties: {
            tycho_marketing_consent: 'false',
            tycho_unsubscribed_at: at.toISOString(),
            tycho_unsubscribe_source: source,
          },
        }),
      })
      if (!res.ok) throw new HubSpotError(`Opt-out update failed (${res.status})`, res.status)
    }

    const subscriptionId = process.env.HUBSPOT_MARKETING_SUBSCRIPTION_ID
    if (subscriptionId) {
      const res = await this.request('/communication-preferences/v3/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ emailAddress: email, subscriptionId }),
      })
      // 404/400 here usually means "this address was never subscribed to that
      // type", which is the desired end state anyway — do not fail the opt-out.
      if (!res.ok && res.status !== 404 && res.status !== 400) {
        throw new HubSpotError(
          `Subscription opt-out failed (${res.status})`,
          res.status
        )
      }
    }

    return { contactFound: contactId !== null }
  }

  /** Best-effort company upsert + association (callers treat failure as a warning). */
  async upsertCompanyAndAssociate(contactId: string, companyName: string): Promise<void> {
    const search = await this.request('/crm/v3/objects/companies/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: 'name', operator: 'EQ', value: companyName }],
          },
        ],
        properties: ['name'],
        limit: 1,
      }),
    })
    if (!search.ok) throw new HubSpotError(`Company search failed (${search.status})`, search.status)
    const found = (await search.json()) as { results?: Array<{ id: string }> }

    let companyId = found.results?.[0]?.id
    if (!companyId) {
      const create = await this.request('/crm/v3/objects/companies', {
        method: 'POST',
        body: JSON.stringify({ properties: { name: companyName } }),
      })
      if (!create.ok) throw new HubSpotError(`Company create failed (${create.status})`, create.status)
      companyId = ((await create.json()) as { id: string }).id
    }

    const assoc = await this.request(
      `/crm/v4/objects/contacts/${contactId}/associations/default/companies/${companyId}`,
      { method: 'PUT' }
    )
    if (!assoc.ok) throw new HubSpotError(`Association failed (${assoc.status})`, assoc.status)
  }
}

/** Returns null when no token is configured (dev / demo mode). */
export function createCrmClientFromEnv(): CrmClient | null {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  if (!token) return null
  return new HubSpotClient(token)
}
