-- ============================================================
-- Tycho Systems — Full Database Setup (Run Once in Supabase SQL Editor)
-- Combines migrations 001 + 002 + 003, safe to run on a fresh project
-- ============================================================

-- ─── Utility function (used by all tables for updated_at) ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL,
  full_name     text,
  business_name text,
  phone         text,
  role          text NOT NULL DEFAULT 'client',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Drop any existing role constraint and recreate with all roles
DO $$ BEGIN
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Drop inline constraint if it exists (PostgreSQL auto-names it)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT constraint_name FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_type = 'CHECK'
      AND constraint_name LIKE 'profiles_%'
  LOOP
    EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'client', 'sales'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Sites ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       text NOT NULL,
  domain     text,
  url        text,
  status     text NOT NULL DEFAULT 'building' CHECK (status IN ('building', 'live', 'paused', 'archived')),
  plan       text,
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS sites_updated_at ON public.sites;
CREATE TRIGGER sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Invoices ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invoices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_session_id text,
  stripe_invoice_id text,
  amount_cents      integer NOT NULL,
  currency          text NOT NULL DEFAULT 'usd',
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  description       text,
  items             jsonb NOT NULL DEFAULT '[]',
  paid_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ─── Subscriptions ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id               uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  site_id                 uuid REFERENCES public.sites(id) ON DELETE SET NULL,
  stripe_subscription_id  text,
  plan                    text NOT NULL,
  amount_cents            integer NOT NULL,
  status                  text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'paused')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Health checks ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.health_checks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  status_code     integer,
  response_time_ms integer,
  is_up           boolean NOT NULL DEFAULT false,
  error           text,
  checked_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_checks_site_checked
  ON public.health_checks(site_id, checked_at DESC);

-- ─── Leads (sales pipeline) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  email            text NOT NULL,
  phone            text,
  business_name    text NOT NULL,
  source           text NOT NULL DEFAULT 'Other',
  status           text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed', 'lost')),
  package          text,
  estimated_value  integer NOT NULL DEFAULT 0,
  notes            text,
  assigned_to      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

-- ─── Contracts (custom e-sign + Stripe sell funnel) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.contracts (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pandadoc_document_id   text UNIQUE,
  pandadoc_status        text NOT NULL DEFAULT 'document.draft',
  signing_status         text NOT NULL DEFAULT 'pending',
  signer_name            text,
  signer_ip              text,
  signed_at              timestamptz,
  customer_name          text NOT NULL,
  customer_email         text NOT NULL,
  customer_business      text NOT NULL,
  customer_phone         text,
  items_json             jsonb NOT NULL DEFAULT '[]',
  one_time_total_cents   integer NOT NULL DEFAULT 0,
  recurring_total_cents  integer NOT NULL DEFAULT 0,
  stripe_session_id      text,
  stripe_payment_status  text,
  stripe_subscription_id text,
  lead_id                uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS contracts_updated_at ON public.contracts;
CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS contracts_pandadoc_id_idx ON public.contracts(pandadoc_document_id);
CREATE INDEX IF NOT EXISTS contracts_signing_status_idx ON public.contracts(signing_status);
CREATE INDEX IF NOT EXISTS contracts_customer_email_idx ON public.contracts(customer_email);
CREATE INDEX IF NOT EXISTS contracts_created_at_idx ON public.contracts(created_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts    ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (idempotent)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile"      ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile"    ON public.profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles"    ON public.profiles;
  DROP POLICY IF EXISTS "Clients can view own sites"      ON public.sites;
  DROP POLICY IF EXISTS "Admins can manage all sites"     ON public.sites;
  DROP POLICY IF EXISTS "Clients can view own invoices"   ON public.invoices;
  DROP POLICY IF EXISTS "Admins can manage all invoices"  ON public.invoices;
  DROP POLICY IF EXISTS "Clients can view own subscriptions"  ON public.subscriptions;
  DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Site owners can view health checks"  ON public.health_checks;
  DROP POLICY IF EXISTS "Admins can manage all health checks" ON public.health_checks;
  DROP POLICY IF EXISTS "admins_all_leads"          ON public.leads;
  DROP POLICY IF EXISTS "sales_all_leads"           ON public.leads;
  DROP POLICY IF EXISTS "sales_insert_leads"        ON public.leads;
  DROP POLICY IF EXISTS "admins_all_contracts"      ON public.contracts;
  DROP POLICY IF EXISTS "clients_own_contracts"     ON public.contracts;
  DROP POLICY IF EXISTS "public_insert_contracts"   ON public.contracts;
END $$;

-- Profiles
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Sites
CREATE POLICY "Clients can view own sites"  ON public.sites FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins can manage all sites" ON public.sites FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Invoices
CREATE POLICY "Clients can view own invoices"  ON public.invoices FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins can manage all invoices" ON public.invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subscriptions
CREATE POLICY "Clients can view own subscriptions"  ON public.subscriptions FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Health checks
CREATE POLICY "Site owners can view health checks" ON public.health_checks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sites WHERE sites.id = health_checks.site_id AND sites.client_id = auth.uid()));
CREATE POLICY "Admins can manage all health checks" ON public.health_checks FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Leads
CREATE POLICY "admins_all_leads" ON public.leads FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'sales')));

-- Contracts
CREATE POLICY "admins_all_contracts" ON public.contracts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'sales')));
CREATE POLICY "clients_own_contracts" ON public.contracts FOR SELECT TO authenticated
  USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "public_insert_contracts" ON public.contracts FOR INSERT TO anon, authenticated
  WITH CHECK (true);
