-- ============================================================
-- Tycho Systems — Demo Seed Data
-- Run AFTER 000_run_all_demo.sql on a fresh database.
-- Populates the admin dashboard with realistic sample data.
-- Safe to re-run (uses ON CONFLICT DO NOTHING).
-- ============================================================

DO $$
DECLARE
  -- Fixed demo UUIDs (all start with 'demo' for easy identification)
  uid_maria  uuid := 'deadbeef-0000-0000-0000-000000000001'::uuid;
  uid_james  uuid := 'deadbeef-0000-0000-0000-000000000002'::uuid;
  uid_sophie uuid := 'deadbeef-0000-0000-0000-000000000003'::uuid;

  site_gonzalez uuid;
  site_carter   uuid;
  site_lin      uuid;

BEGIN

  -- ─── 1. Create auth.users (demo accounts, no real passwords) ─────────────
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES
    ('00000000-0000-0000-0000-000000000000', uid_maria,  'authenticated', 'authenticated',
     'maria@demo.local',  '', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Maria Gonzalez"}',
     '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', uid_james,  'authenticated', 'authenticated',
     'james@demo.local',  '', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"James Carter"}',
     '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', uid_sophie, 'authenticated', 'authenticated',
     'sophie@demo.local', '', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Sophie Lin"}',
     '', '', '', '')
  ON CONFLICT (id) DO NOTHING;

  -- ─── 2. Update profiles (trigger auto-created them on insert above) ────────
  -- If trigger didn't fire (e.g. trigger disabled), insert profiles directly
  INSERT INTO public.profiles (id, email, full_name, business_name, phone, role, created_at)
  VALUES
    (uid_maria,  'maria@demo.local',  'Maria Gonzalez', 'Gonzalez Cleaning Co', '(555) 201-4411', 'client', NOW() - INTERVAL '45 days'),
    (uid_james,  'james@demo.local',  'James Carter',   'Carter & Sons Plumbing', '(555) 348-9920', 'client', NOW() - INTERVAL '30 days'),
    (uid_sophie, 'sophie@demo.local', 'Sophie Lin',     'Lin Bistro', '(555) 087-3362', 'client', NOW() - INTERVAL '14 days')
  ON CONFLICT (id) DO UPDATE SET
    full_name     = EXCLUDED.full_name,
    business_name = EXCLUDED.business_name,
    phone         = EXCLUDED.phone,
    role          = EXCLUDED.role;

  -- ─── 3. Sites ─────────────────────────────────────────────────────────────
  INSERT INTO public.sites (client_id, name, domain, url, status, plan, notes, created_at)
  VALUES
    (uid_maria,  'Gonzalez Cleaning Co', 'gonzalezcleaners.com', 'https://gonzalezcleaners.com',
     'live', 'Care Plan', 'Monthly care plan active. SEO working well.', NOW() - INTERVAL '40 days'),
    (uid_james,  'Carter & Sons Plumbing', 'carterplumbing.com', NULL,
     'building', 'Starter', 'In progress — awaiting logo assets from client.', NOW() - INTERVAL '10 days'),
    (uid_sophie, 'Lin Bistro', 'linbistro.com', 'https://linbistro.com',
     'live', 'Growth', 'Online reservation widget integrated.', NOW() - INTERVAL '8 days');

  -- Fetch site IDs for health checks and invoices
  SELECT id INTO site_gonzalez FROM public.sites WHERE domain = 'gonzalezcleaners.com' LIMIT 1;
  SELECT id INTO site_carter   FROM public.sites WHERE domain = 'carterplumbing.com'   LIMIT 1;
  SELECT id INTO site_lin      FROM public.sites WHERE domain = 'linbistro.com'         LIMIT 1;

  -- ─── 4. Invoices ──────────────────────────────────────────────────────────
  INSERT INTO public.invoices (client_id, amount_cents, currency, status, description, paid_at, created_at)
  VALUES
    -- Maria: website build (paid) + care plan months
    (uid_maria, 240000, 'usd', 'paid',    'Starter website build — Gonzalez Cleaning Co', NOW() - INTERVAL '38 days', NOW() - INTERVAL '40 days'),
    (uid_maria,   8900, 'usd', 'paid',    'Care Plan — Month 1', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    (uid_maria,   8900, 'usd', 'pending', 'Care Plan — Month 2', NULL, NOW() - INTERVAL '1 day'),
    -- James: website build (pending payment after signing)
    (uid_james, 320000, 'usd', 'pending', 'Growth website build — Carter & Sons Plumbing', NULL, NOW() - INTERVAL '9 days'),
    -- Sophie: website build (paid) + first month
    (uid_sophie, 180000, 'usd', 'paid',   'Starter website build — Lin Bistro', NOW() - INTERVAL '6 days', NOW() - INTERVAL '8 days'),
    (uid_sophie,   8900, 'usd', 'paid',   'Care Plan — Month 1 (included trial)', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

  -- ─── 5. Health checks (90 checks per live site over 7.5 hours) ────────────
  -- gonzalezcleaners.com — all up, stable response times
  INSERT INTO public.health_checks (site_id, status_code, response_time_ms, is_up, checked_at)
  SELECT
    site_gonzalez,
    200,
    120 + floor(random() * 180)::int,
    true,
    NOW() - (i * INTERVAL '5 minutes')
  FROM generate_series(0, 89) AS s(i);

  -- linbistro.com — mostly up, 3 recent blips
  INSERT INTO public.health_checks (site_id, status_code, response_time_ms, is_up, checked_at)
  SELECT
    site_lin,
    CASE WHEN i IN (2, 15, 43) THEN 503 ELSE 200 END,
    CASE WHEN i IN (2, 15, 43) THEN 0   ELSE 150 + floor(random() * 300)::int END,
    i NOT IN (2, 15, 43),
    NOW() - (i * INTERVAL '5 minutes')
  FROM generate_series(0, 89) AS s(i);

  RAISE NOTICE 'Demo seed complete. 3 clients, 3 sites, 6 invoices, 180 health check records.';
END $$;
