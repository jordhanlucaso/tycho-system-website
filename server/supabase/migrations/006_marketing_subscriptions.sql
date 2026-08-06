-- Migration 006: Marketing subscription state (opt-in / opt-out)
-- Run after 005_lead_magnet_requests.sql
--
-- One row per email address, keyed on the same SHA-256 hash used by
-- lead_magnet_requests so the two can be joined without either table ever
-- holding a plaintext address. Contact details themselves live in HubSpot.
--
-- HubSpot remains the source of truth for *who receives* a marketing campaign
-- (active lists keyed on tycho_marketing_consent). This table is the
-- application's own suppression list: it is checked at the final sending
-- boundary in sendMarketingEmail(), so a contact who has opted out cannot be
-- emailed even if a HubSpot list is stale or a sync failed.

CREATE TABLE IF NOT EXISTS marketing_subscriptions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash           text NOT NULL UNIQUE,
  crm_contact_id       text,

  status               text NOT NULL DEFAULT 'unsubscribed'
                       CHECK (status IN ('subscribed', 'unsubscribed')),

  -- Opt-in provenance (mirrors the fields already captured for lead magnets).
  consent_source       text,
  consent_text_version text,
  subscribed_at        timestamptz,

  -- Opt-out provenance. 'source' records how it happened, e.g.
  -- 'email_link', 'one_click_header', 'manual'.
  unsubscribed_at      timestamptz,
  unsubscribe_source   text,

  -- Whether the opt-out has been mirrored to the CRM. 'pending' rows can be
  -- retried without re-reading the recipient's address from anywhere else.
  crm_sync_status      text NOT NULL DEFAULT 'skipped'
                       CHECK (crm_sync_status IN ('synced', 'pending', 'failed', 'skipped')),

  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketing_subscriptions_status_idx
  ON marketing_subscriptions (status);
CREATE INDEX IF NOT EXISTS marketing_subscriptions_crm_sync_idx
  ON marketing_subscriptions (crm_sync_status)
  WHERE crm_sync_status IN ('pending', 'failed');

-- Auto-update updated_at (function defined in 002_leads_schema.sql).
CREATE TRIGGER marketing_subscriptions_updated_at
  BEFORE UPDATE ON marketing_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: only the service role (which bypasses RLS) writes here. Admins may read
-- it from the dashboard; anon/authenticated get nothing.
ALTER TABLE marketing_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_marketing_subscriptions" ON marketing_subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
