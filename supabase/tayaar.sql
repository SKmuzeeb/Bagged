-- zippd — complete database setup
-- One file: extensions, tables, indexes, the new-user trigger, and the seed
-- data (5 kiranas + a 30-item catalog each) for every page in the app
-- (Landing, Stores, Shop, Cart, Checkout, Order Confirmation, Orders, Login).
--
-- This targets a PLAIN Postgres database (local Postgres, Docker, etc.) —
-- it does NOT depend on Supabase's managed `auth` schema. Supabase
-- normally provisions `auth.users` for you automatically; if you're
-- running against your own local Postgres instead, that schema doesn't
-- exist, so this file defines its own `users` table and skips
-- Supabase-specific Row Level Security (which relies on the `auth.uid()`
-- function that only exists inside Supabase's auth service). See the note
-- at the bottom for how to layer real RLS back in once you connect actual
-- Supabase Auth.
--
-- Run this once — the Supabase SQL editor, `psql -f supabase/tayaar.sql`,
-- or `supabase db reset` with this as a migration all work. Safe to
-- re-run: tables use `if not exists` and the seed rows use
-- `on conflict do nothing`.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

-- Login: a signed-in person. Stands in for Supabase's `auth.users` so this
-- schema works on a plain Postgres database.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Login: app-specific profile fields, kept separate from `users` the same
-- way Supabase separates `auth.users` from a `public.profiles` table.
create table if not exists profiles (
  id uuid primary key references users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- Landing, Stores, Shop, Checkout, Order Confirmation: the kirana being
-- ordered from. `locality` + `city` back the Stores search page and the
-- navbar location picker, which filters kiranas down to the customer's city
-- so nobody orders from a store in a city they can't walk into.
create table if not exists kiranas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  owner_name text not null,
  address text not null,
  locality text not null,
  city text not null,
  phone text not null,
  tagline text,
  hours_open time not null default '07:00',
  hours_close time not null default '22:00',
  created_at timestamptz not null default now()
);

-- Shop: the product catalog.
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  kirana_id uuid not null references kiranas (id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  price_rupees numeric(10, 2) not null check (price_rupees >= 0),
  unit text not null check (unit in ('kg', 'g', 'pcs', 'l', 'pack')),
  image_url text,
  in_stock boolean not null default true,
  min_order_qty numeric(6, 2) not null default 1,
  step numeric(6, 2) not null default 1,
  created_at timestamptz not null default now(),
  unique (kirana_id, name)
);

-- Shop / Product cards: a user's saved favorites.
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Checkout / Order Confirmation / Orders: a placed order.
create table if not exists orders (
  id text primary key,
  user_id uuid references users (id) on delete set null,
  kirana_id uuid not null references kiranas (id),
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'picked_up', 'cancelled')),
  pickup_slot timestamptz not null,
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null default 'pay_at_pickup',
  created_at timestamptz not null default now()
);

-- Checkout / Order Confirmation / Orders: line items on a placed order.
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  name text not null,
  description text,
  price_rupees numeric(10, 2) not null,
  unit text not null,
  quantity numeric(6, 2) not null check (quantity > 0)
);

-- ─────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────

create index if not exists idx_kiranas_city
  on kiranas (city);

create index if not exists idx_products_kirana_category_stock
  on products (kirana_id, category, in_stock);

create index if not exists idx_orders_user_created
  on orders (user_id, created_at desc);

create index if not exists idx_order_items_order
  on order_items (order_id);

create index if not exists idx_favorites_user
  on favorites (user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- New-user trigger: create a profile row automatically when a user signs up.
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

drop trigger if exists on_user_created on users;

create trigger on_user_created
  after insert on users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Seed data: 5 kiranas + a shared 30-item catalog, matching
-- src/data/kiranas.js and src/data/sampleProducts.js exactly so local demo
-- mode and a connected database show identical stores, prices, and stock.
-- ─────────────────────────────────────────────────────────────────────────

insert into kiranas (name, owner_name, address, locality, city, phone, tagline, hours_open, hours_close)
values
  ('Rakesh Kirana Store', 'Rakesh Sharma', 'Shop 12, Gachibowli Main Road, Hyderabad 500032', 'Gachibowli, Hyderabad', 'Hyderabad', '+91 98765 43210', 'Serving Gachibowli since 1998', '07:00', '22:00'),
  ('Sharma General Store', 'Vinod Sharma', 'Shop 4, 100 Feet Road, Indiranagar, Bangalore 560038', 'Indiranagar, Bangalore', 'Bangalore', '+91 98450 11223', 'Your corner store since 2005', '07:00', '22:00'),
  ('Gupta Provision Store', 'Anita Gupta', 'Shop 7, Veera Desai Road, Andheri West, Mumbai 400058', 'Andheri West, Mumbai', 'Mumbai', '+91 98200 33445', 'Family-run since 1985', '07:00', '22:00'),
  ('Patel Kirana & Grocers', 'Jayesh Patel', 'B-22, Satellite Road, Ahmedabad 380015', 'Satellite, Ahmedabad', 'Ahmedabad', '+91 98980 55667', 'Quality groceries since 1992', '07:00', '22:00'),
  ('Singh Super Bazaar', 'Harpreet Singh', 'Shop 15, Central Market, Lajpat Nagar, Delhi 110024', 'Lajpat Nagar, Delhi', 'Delhi', '+91 98100 77889', 'Neighborhood favorite since 2001', '07:00', '22:00')
on conflict (name) do update set
  locality = excluded.locality,
  city = excluded.city;

-- Real kirana stores mostly carry the same staples — each store below gets
-- the same 30-item template, priced with its own multiplier and missing a
-- couple of items, the same logic src/data/sampleProducts.js uses.
with product_template (key, name, description, category, unit, step, min_order_qty, base_price, image_url) as (
  values
    ('rice', 'Basmati Rice', 'Long-grain aromatic rice, perfect for everyday meals.', 'staples', 'kg', 0.25, 1, 120, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80'),
    ('atta', 'Wheat Atta', 'Whole wheat flour, stone-ground for soft rotis.', 'staples', 'kg', 0.25, 1, 55, 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80'),
    ('toor_dal', 'Toor Dal', 'Split pigeon peas, a kitchen staple for daily dal.', 'staples', 'kg', 0.25, 1, 140, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80'),
    ('sugar', 'Sugar', 'Fine white sugar for tea, coffee, and baking.', 'staples', 'kg', 0.25, 1, 45, 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&q=80'),
    ('salt', 'Salt', 'Iodized table salt for everyday cooking.', 'staples', 'kg', 0.25, 1, 22, 'https://images.unsplash.com/photo-1518110925495-b37653dfb0e0?w=600&q=80'),
    ('bread', 'Bread', 'Soft sliced bread, baked fresh daily.', 'staples', 'pack', 1, 1, 45, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80'),

    ('sunflower_oil', 'Sunflower Oil', 'Light, refined cooking oil for everyday frying.', 'oils', 'l', 0.25, 1, 150, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80'),
    ('mustard_oil', 'Mustard Oil', 'Cold-pressed oil with a bold, pungent flavor.', 'oils', 'l', 0.25, 1, 165, 'https://images.unsplash.com/photo-1620705851610-fa39d0d40dfa?w=600&q=80'),

    ('tomato', 'Tomato', 'Fresh, ripe tomatoes for cooking and salads.', 'vegetables', 'kg', 0.25, 1, 30, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80'),
    ('onion', 'Onion', 'Fresh onions, a base for most everyday dishes.', 'vegetables', 'kg', 0.25, 1, 35, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80'),
    ('potato', 'Potato', 'All-purpose potatoes for curries, fries, and more.', 'vegetables', 'kg', 0.25, 1, 25, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80'),
    ('green_chilli', 'Green Chilli', 'Fresh green chillies for heat and flavor.', 'vegetables', 'kg', 0.25, 1, 60, 'https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=600&q=80'),
    ('coriander', 'Coriander', 'Fresh coriander leaves for garnish and flavor.', 'vegetables', 'pack', 1, 1, 10, 'https://images.unsplash.com/photo-1600788907416-456578634209?w=600&q=80'),
    ('ginger', 'Ginger', 'Fresh ginger root for cooking and tea.', 'vegetables', 'kg', 0.25, 1, 90, 'https://images.unsplash.com/photo-1573414405626-8b3168ffea4c?w=600&q=80'),
    ('garlic', 'Garlic', 'Fresh garlic bulbs, a kitchen essential.', 'vegetables', 'kg', 0.25, 1, 110, 'https://images.unsplash.com/photo-1615477550927-6ec8445fabbf?w=600&q=80'),

    ('milk', 'Milk', 'Fresh full-cream milk, delivered daily.', 'dairy', 'l', 0.5, 1, 32, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80'),
    ('curd', 'Curd', 'Fresh, thick homestyle yogurt.', 'dairy', 'pack', 1, 1, 40, 'https://images.unsplash.com/photo-1571212515416-fca325dbfe12?w=600&q=80'),
    ('paneer', 'Paneer', 'Soft cottage cheese, ideal for curries.', 'dairy', 'kg', 0.25, 1, 320, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80'),
    ('ghee', 'Ghee', 'Pure clarified butter with a rich, nutty aroma.', 'dairy', 'kg', 0.25, 1, 550, 'https://images.unsplash.com/photo-1631452180775-2b26c9fc6c04?w=600&q=80'),
    ('butter', 'Butter', 'Creamy, salted table butter.', 'dairy', 'pack', 1, 1, 250, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80'),
    ('eggs', 'Eggs', 'Farm-fresh eggs, sold by the half-dozen.', 'dairy', 'pcs', 1, 6, 7, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=80'),

    ('maggi', 'Maggi Noodles', 'Quick-cooking instant noodles with masala flavor.', 'snacks', 'pcs', 1, 1, 14, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80'),
    ('parle_g', 'Parle-G Biscuits', 'Classic glucose biscuits, a household favorite.', 'snacks', 'pack', 1, 1, 10, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80'),
    ('chips', 'Potato Chips', 'Crispy, salted potato chips.', 'snacks', 'pack', 1, 1, 20, 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=600&q=80'),
    ('mixture', 'Mixture Snacks', 'A spicy, crunchy mix of fried snacks.', 'snacks', 'pack', 1, 1, 45, 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80'),

    ('tea', 'Tea Leaves', 'Strong black tea leaves for a proper cup of chai.', 'beverages', 'pack', 1, 1, 180, 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&q=80'),
    ('coffee', 'Filter Coffee', 'Roasted and ground coffee for a classic filter brew.', 'beverages', 'pack', 1, 1, 220, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80'),

    ('soap', 'Soap Bar', 'Everyday bathing soap bar.', 'household', 'pcs', 1, 1, 35, 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80'),
    ('detergent', 'Detergent Powder', 'All-purpose laundry detergent powder.', 'household', 'pack', 1, 1, 95, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&q=80'),
    ('toothpaste', 'Toothpaste', 'Everyday fluoride toothpaste for daily care.', 'household', 'pcs', 1, 1, 55, 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80')
),
kirana_config (kirana_name, price_multiplier, out_of_stock_keys) as (
  values
    ('Rakesh Kirana Store', 1.00, array['garlic', 'mixture']),
    ('Sharma General Store', 1.10, array['ginger']),
    ('Gupta Provision Store', 1.20, array['paneer', 'ghee']),
    ('Patel Kirana & Grocers', 0.90, array['eggs']),
    ('Singh Super Bazaar', 1.05, array['curd', 'butter'])
)
insert into products
  (kirana_id, name, description, category, price_rupees, unit, image_url, in_stock, min_order_qty, step)
select
  k.id,
  t.name,
  t.description,
  t.category,
  round(t.base_price * c.price_multiplier),
  t.unit,
  t.image_url,
  not (t.key = any (c.out_of_stock_keys)),
  t.min_order_qty,
  t.step
from product_template t
cross join kirana_config c
join kiranas k on k.name = c.kirana_name
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Adding real Row Level Security later
-- ─────────────────────────────────────────────────────────────────────────
--
-- This file intentionally ships without RLS policies, since `auth.uid()`
-- only exists once Supabase Auth is actually issuing sessions — on a plain
-- Postgres database there is no signed-in "current user" for a policy to
-- check. If you later point this schema at a real Supabase project with
-- Auth enabled, swap the `users` table below for Supabase's `auth.users`
-- (drop this file's `users` table and repoint the `profiles.id` /
-- `orders.user_id` / `favorites.user_id` foreign keys at `auth.users`),
-- then re-enable RLS with policies like:
--
--   alter table orders enable row level security;
--   create policy "Users can view their own orders"
--     on orders for select using (auth.uid() = user_id);
