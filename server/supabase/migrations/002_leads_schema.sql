-- Migration 002: Leads table for sales pipeline
-- Run after 001_initial_schema.sql

-- Add 'sales' role to profiles (extend existing check constraint)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'client', 'sales'));

-- Leads table for sales pipeline tracking
CREATE TABLE IF NOT EXISTS leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text,
  business_name text NOT NULL,
  source        text NOT NULL DEFAULT 'Other',
  status        text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'quoted', 'closed', 'lost')),
  package       text,
  estimated_value integer NOT NULL DEFAULT 0,  -- in cents
  notes         text,
  assigned_to   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Row-level security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "admins_all_leads" ON leads
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Sales team can view and manage all leads
CREATE POLICY "sales_all_leads" ON leads
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'sales')
  );

-- Sales team can insert new leads
CREATE POLICY "sales_insert_leads" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'sales'))
  );
