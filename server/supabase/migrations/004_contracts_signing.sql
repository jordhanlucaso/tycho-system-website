-- Migration 004: Add custom e-signature fields to contracts table.
-- Replaces the PandaDoc signing flow with an in-house typed-name signature.
-- pandadoc_document_id is made nullable (NULL for all new contracts).

ALTER TABLE contracts
  ALTER COLUMN pandadoc_document_id DROP NOT NULL;

ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS signing_status TEXT    NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS signer_name    TEXT,
  ADD COLUMN IF NOT EXISTS signer_ip      TEXT,
  ADD COLUMN IF NOT EXISTS signed_at      TIMESTAMPTZ;

-- Index for fast lookup by signing status
CREATE INDEX IF NOT EXISTS contracts_signing_status_idx ON contracts (signing_status);
