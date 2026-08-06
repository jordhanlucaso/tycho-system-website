import { createHash } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * The application's marketing subscription state.
 *
 * Split into an interface plus a Supabase-backed implementation so the sending
 * guard and the unsubscribe route can be tested without a database, matching
 * the dependency-injection style already used by the lead-magnet service.
 *
 * Addresses are only ever stored hashed — see migration 006.
 */

export type SubscriptionStatus = 'subscribed' | 'unsubscribed'

export type SubscriptionRecord = {
  email_hash: string
  status: SubscriptionStatus
  crm_contact_id: string | null
  consent_source: string | null
  consent_text_version: string | null
  subscribed_at: string | null
  unsubscribed_at: string | null
  unsubscribe_source: string | null
  crm_sync_status: 'synced' | 'pending' | 'failed' | 'skipped'
}

export type SubscribeInput = {
  emailHash: string
  crmContactId?: string | null
  consentSource: string
  consentTextVersion?: string | null
  at: Date
}

export type UnsubscribeInput = {
  emailHash: string
  source: string
  at: Date
  crmSyncStatus: SubscriptionRecord['crm_sync_status']
}

export interface MarketingSubscriptionStore {
  get(emailHash: string): Promise<SubscriptionRecord | null>
  /** Record an explicit opt-in. Idempotent. */
  subscribe(input: SubscribeInput): Promise<void>
  /** Record an opt-out. Idempotent — repeating it is a no-op, not an error. */
  unsubscribe(input: UnsubscribeInput): Promise<void>
}

/** Same hashing as the lead-magnet audit trail, so the two tables line up. */
export function hashEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
}

/**
 * Is this address allowed to receive marketing?
 *
 * Fails **closed**: an unknown address has never opted in, so it is not
 * marketable. This is what stops a campaign from mailing a list of addresses
 * that were never asked.
 */
export function isMarketable(record: SubscriptionRecord | null): boolean {
  return record?.status === 'subscribed'
}

const TABLE = 'marketing_subscriptions'

/**
 * Supabase-backed implementation. Typed against the real client rather than a
 * hand-written structural type — postgrest's builder types are too intricate to
 * mirror usefully. Tests exercise the `MarketingSubscriptionStore` interface
 * with an in-memory implementation instead; this adapter is deliberately thin
 * enough that there is little here to get wrong.
 */
export function createSupabaseSubscriptionStore(
  client: SupabaseClient
): MarketingSubscriptionStore {
  return {
    async get(emailHash) {
      const { data, error } = await client
        .from(TABLE)
        .select(
          'email_hash,status,crm_contact_id,consent_source,consent_text_version,subscribed_at,unsubscribed_at,unsubscribe_source,crm_sync_status'
        )
        .eq('email_hash', emailHash)
        .maybeSingle()

      if (error) throw new Error(error.message)
      return (data as SubscriptionRecord | null) ?? null
    },

    async subscribe(input) {
      const { error } = await client.from(TABLE).upsert(
        {
          email_hash: input.emailHash,
          status: 'subscribed',
          ...(input.crmContactId ? { crm_contact_id: input.crmContactId } : {}),
          consent_source: input.consentSource,
          consent_text_version: input.consentTextVersion ?? null,
          subscribed_at: input.at.toISOString(),
          // Clear the previous opt-out so the row reads as a clean re-opt-in.
          unsubscribed_at: null,
          unsubscribe_source: null,
          updated_at: input.at.toISOString(),
        },
        { onConflict: 'email_hash' }
      )
      if (error) throw new Error(error.message)
    },

    async unsubscribe(input) {
      const { error } = await client.from(TABLE).upsert(
        {
          email_hash: input.emailHash,
          status: 'unsubscribed',
          unsubscribed_at: input.at.toISOString(),
          unsubscribe_source: input.source,
          crm_sync_status: input.crmSyncStatus,
          updated_at: input.at.toISOString(),
        },
        { onConflict: 'email_hash' }
      )
      if (error) throw new Error(error.message)
    },
  }
}
