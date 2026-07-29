-- Migration 005: Lead-magnet funnel audit records
-- Run after 004_contracts_signing.sql
--
-- Stores one row per (email, resource) request. Full contact data lives in
-- HubSpot; locally we keep only a SHA-256 email hash plus the CRM contact
-- reference, classification outcome, consent state and attribution.

CREATE TABLE IF NOT EXISTS lead_magnet_requests (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash            text NOT NULL,
  crm_contact_id        text,
  requested_resource    text NOT NULL
                        CHECK (requested_resource IN ('ai_operations_pain_map', 'ai_dictionary')),
  delivered_resource    text NOT NULL
                        CHECK (delivered_resource IN ('ai_operations_pain_map', 'ai_dictionary')),
  audience_segment      text NOT NULL
                        CHECK (audience_segment IN ('business_leader', 'ai_builder_learner')),
  classification_reason text NOT NULL,
  role_category         text NOT NULL,
  marketing_consent     boolean NOT NULL DEFAULT false,
  consent_text_version  text NOT NULL,
  source_platform       text,
  source_campaign       text,
  source_content_id     text,
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  crm_status            text NOT NULL DEFAULT 'skipped'
                        CHECK (crm_status IN ('synced', 'failed', 'skipped')),
  email_status          text NOT NULL DEFAULT 'skipped'
                        CHECK (email_status IN ('sent', 'failed', 'skipped')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Idempotency: repeat submissions for the same resource update the row.
CREATE UNIQUE INDEX IF NOT EXISTS lead_magnet_requests_email_resource_idx
  ON lead_magnet_requests (email_hash, requested_resource);

CREATE INDEX IF NOT EXISTS lead_magnet_requests_segment_idx
  ON lead_magnet_requests (audience_segment);
CREATE INDEX IF NOT EXISTS lead_magnet_requests_created_at_idx
  ON lead_magnet_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS lead_magnet_requests_campaign_idx
  ON lead_magnet_requests (source_campaign)
  WHERE source_campaign IS NOT NULL;

-- Auto-update updated_at (function defined in 002_leads_schema.sql).
CREATE TRIGGER lead_magnet_requests_updated_at
  BEFORE UPDATE ON lead_magnet_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: only the service role (which bypasses RLS) touches this table. Admins
-- may read it from the dashboard; anon/authenticated get nothing else.
ALTER TABLE lead_magnet_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_lead_magnet_requests" ON lead_magnet_requests
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
