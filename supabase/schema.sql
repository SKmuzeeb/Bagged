-- Tayaar — schema.sql
-- Run this against a fresh Supabase project (SQL Editor, or `supabase db push`).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists kiranas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_name text not null,
  address text not null,
  phone text not null,
  tagline text,
  hours_open time not null default '07:00',
  hours_close time not null default '22:00',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  kirana_id uuid not null references kiranas (id) on delete cascade,
  name text not null,
  name_hindi text,
  category text not null,
  price_rupees numeric(10, 2) not null check (price_rupees >= 0),
  unit text not null check (unit in ('kg', 'g', 'pcs', 'l', 'pack')),
  image_url text,
  in_stock boolean not null default true,
  min_order_qty numeric(6, 2) not null default 1,
  step numeric(6, 2) not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  user_id uuid references auth.users (id) on delete set null,
  kirana_id uuid not null references kiranas (id),
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'picked_up', 'cancelled')),
  pickup_slot timestamptz not null,
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null default 'pay_at_pickup',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  name text not null,
  name_hindi text,
  price_rupees numeric(10, 2) not null,
  unit text not null,
  quantity numeric(6, 2) not null check (quantity > 0)
);

-- ─────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────

create index if not exists idx_products_kirana_category_stock
  on products (kirana_id, category, in_stock);

create index if not exists idx_orders_user_created
  on orders (user_id, created_at desc);

create index if not exists idx_order_items_order
  on order_items (order_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────

alter table kiranas enable row level security;
alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Kiranas & products are public catalog data.
create policy "Public can read kiranas"
  on kiranas for select
  using (true);

create policy "Public can read products"
  on products for select
  using (true);

-- Profiles: users manage only their own row.
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Orders: users can create and read only their own orders.
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on orders for update
  using (auth.uid() = user_id);

-- Order items: readable/insertable only via the parent order's ownership.
create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert their own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- New-user trigger: create a profile row automatically on signup.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
