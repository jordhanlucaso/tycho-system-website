-- ============================================================
-- Tycho Systems — Initial Database Schema
-- ============================================================

-- Profiles (extends auth.users with role and business info)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  business_name text,
  phone text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sites (managed client websites)
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  domain text,
  url text,
  status text not null default 'building' check (status in ('building', 'live', 'paused', 'archived')),
  plan text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  stripe_session_id text,
  stripe_invoice_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  description text,
  items jsonb not null default '[]'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- Subscriptions (monthly Care plans)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  site_id uuid references public.sites(id) on delete set null,
  stripe_subscription_id text,
  plan text not null,
  amount_cents integer not null,
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'paused')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Health checks (site uptime monitoring)
create table if not exists public.health_checks (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  status_code integer,
  response_time_ms integer,
  is_up boolean not null default false,
  error text,
  checked_at timestamptz not null default now()
);

-- Index for fast health check lookups
create index if not exists idx_health_checks_site_checked
  on public.health_checks(site_id, checked_at desc);

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace trigger sites_updated_at
  before update on public.sites
  for each row execute procedure public.set_updated_at();

create or replace trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Row Level Security Policies
-- ============================================================

alter table public.profiles enable row level security;
alter table public.sites enable row level security;
alter table public.invoices enable row level security;
alter table public.subscriptions enable row level security;
alter table public.health_checks enable row level security;

-- Profiles: users can read/update their own, admins can read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Sites: clients see their own, admins see all
create policy "Clients can view own sites"
  on public.sites for select
  using (client_id = auth.uid());

create policy "Admins can manage all sites"
  on public.sites for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Invoices: clients see their own, admins see all
create policy "Clients can view own invoices"
  on public.invoices for select
  using (client_id = auth.uid());

create policy "Admins can manage all invoices"
  on public.invoices for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Subscriptions: clients see their own, admins see all
create policy "Clients can view own subscriptions"
  on public.subscriptions for select
  using (client_id = auth.uid());

create policy "Admins can manage all subscriptions"
  on public.subscriptions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Health checks: admins and site owners can view
create policy "Site owners can view health checks"
  on public.health_checks for select
  using (
    exists (
      select 1 from public.sites
      where sites.id = health_checks.site_id
        and sites.client_id = auth.uid()
    )
  );

create policy "Admins can manage all health checks"
  on public.health_checks for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
