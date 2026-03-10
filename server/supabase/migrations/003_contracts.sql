-- Migration 003: Contracts table for PandaDoc + Stripe sell funnel
-- Run after 002_leads_schema.sql

CREATE TABLE IF NOT EXISTS contracts (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- PandaDoc
  pandadoc_document_id     text NOT NULL UNIQUE,
  pandadoc_status          text NOT NULL DEFAULT 'document.draft',

  -- Customer info (captured at checkout, stored as source of truth)
  customer_name            text NOT NULL,
  customer_email           text NOT NULL,
  customer_business        text NOT NULL,
  customer_phone           text,

  -- Cart items snapshot (JSON array of CartItem objects)
  items_json               jsonb NOT NULL DEFAULT '[]',
  one_time_total_cents     integer NOT NULL DEFAULT 0,
  recurring_total_cents    integer NOT NULL DEFAULT 0,

  -- Stripe (filled after payment initiated)
  stripe_session_id        text,
  stripe_payment_status    text,       -- 'unpaid' | 'paid' | 'no_payment_required'
  stripe_subscription_id   text,       -- filled for recurring payments

  -- Linked to a lead if the deal was tracked in the sales pipeline
  lead_id                  uuid REFERENCES leads(id) ON DELETE SET NULL,

  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS contracts_pandadoc_id_idx ON contracts(pandadoc_document_id);
CREATE INDEX IF NOT EXISTS contracts_customer_email_idx ON contracts(customer_email);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON contracts(pandadoc_status);
CREATE INDEX IF NOT EXISTS contracts_created_at_idx ON contracts(created_at DESC);

-- Row-level security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Admins can see all contracts
CREATE POLICY "admins_all_contracts" ON contracts
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'sales'))
  );

-- Clients can only see their own contracts
CREATE POLICY "clients_own_contracts" ON contracts
  FOR SELECT TO authenticated
  USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Anonymous insert allowed (public checkout flow)
CREATE POLICY "public_insert_contracts" ON contracts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
