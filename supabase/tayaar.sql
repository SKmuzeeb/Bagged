-- Tayaar — complete database setup
-- One file: extensions, tables, indexes, RLS policies, the new-user
-- trigger, and the seed data (one kirana + 30 products) for every page in
-- the app (Landing, Shop, Cart, Checkout, Order Confirmation, Orders, Login).
--
-- Run this once against a fresh Postgres/Supabase database — the Supabase
-- SQL Editor, `psql -f supabase/tayaar.sql`, or `supabase db reset` with
-- this as your migration. Safe to re-run: tables use `if not exists` and
-- the seed rows use `on conflict do nothing`.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

-- Landing, Shop, Checkout, Order Confirmation: the kirana being ordered from.
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

-- Shop: the product catalog.
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

-- Login: one row per authenticated user, created automatically (see trigger below).
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- Checkout / Order Confirmation / Orders: a placed order.
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

-- Checkout / Order Confirmation / Orders: line items on a placed order.
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

-- Kiranas & products are public catalog data (Landing, Shop pages).
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

-- Orders: users can create and read only their own orders (Checkout, Orders pages).
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
-- New-user trigger: create a profile row automatically on signup (Login page).
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

-- ─────────────────────────────────────────────────────────────────────────
-- Seed data: one kirana + 30 products, matching src/data/sampleProducts.js
-- exactly so local demo mode and a connected database show identical data.
-- ─────────────────────────────────────────────────────────────────────────

insert into kiranas (name, owner_name, address, phone, tagline, hours_open, hours_close)
values (
  'Rakesh Kirana Store',
  'Rakesh Sharma',
  'Shop 12, Gachibowli Main Road, Hyderabad 500032',
  '+91 98765 43210',
  'Serving Gachibowli since 1998',
  '07:00',
  '22:00'
)
on conflict do nothing;

insert into products
  (kirana_id, name, name_hindi, category, price_rupees, unit, image_url, in_stock, min_order_qty, step)
values
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Basmati Rice', 'बासमती चावल', 'staples', 120, 'kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Wheat Atta', 'गेहूं का आटा', 'staples', 55, 'kg', 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Toor Dal', 'तूर दाल', 'staples', 140, 'kg', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Sugar', 'चीनी', 'staples', 45, 'kg', 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Salt', 'नमक', 'staples', 22, 'kg', 'https://images.unsplash.com/photo-1518110925495-b37653dfb0e0?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Bread', 'ब्रेड', 'staples', 45, 'pack', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', true, 1, 1),

  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Sunflower Oil', 'सूरजमुखी तेल', 'oils', 150, 'l', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Mustard Oil', 'सरसों तेल', 'oils', 165, 'l', 'https://images.unsplash.com/photo-1620705851610-fa39d0d40dfa?w=600&q=80', true, 1, 0.25),

  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Tomato', 'टमाटर', 'vegetables', 30, 'kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Onion', 'प्याज़', 'vegetables', 35, 'kg', 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Potato', 'आलू', 'vegetables', 25, 'kg', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Green Chilli', 'हरी मिर्च', 'vegetables', 60, 'kg', 'https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Coriander', 'धनिया पत्ता', 'vegetables', 10, 'pack', 'https://images.unsplash.com/photo-1600788907416-456578634209?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Ginger', 'अदरक', 'vegetables', 90, 'kg', 'https://images.unsplash.com/photo-1573414405626-8b3168ffea4c?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Garlic', 'लहसुन', 'vegetables', 110, 'kg', 'https://images.unsplash.com/photo-1615477550927-6ec8445fabbf?w=600&q=80', false, 1, 0.25),

  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Milk', 'दूध', 'dairy', 32, 'l', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', true, 1, 0.5),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Curd', 'दही', 'dairy', 40, 'pack', 'https://images.unsplash.com/photo-1571212515416-fca325dbfe12?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Paneer', 'पनीर', 'dairy', 320, 'kg', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Ghee', 'घी', 'dairy', 550, 'kg', 'https://images.unsplash.com/photo-1631452180775-2b26c9fc6c04?w=600&q=80', true, 1, 0.25),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Butter', 'मक्खन', 'dairy', 250, 'pack', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Eggs', 'अंडा', 'dairy', 7, 'pcs', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=80', true, 6, 1),

  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Maggi Noodles', 'मैगी नूडल्स', 'snacks', 14, 'pcs', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Parle-G Biscuits', 'पार्ले-जी बिस्कुट', 'snacks', 10, 'pack', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Potato Chips', 'आलू चिप्स', 'snacks', 20, 'pack', 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Mixture Snacks', 'मिक्सचर', 'snacks', 45, 'pack', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80', false, 1, 1),

  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Tea Leaves', 'चाय पत्ती', 'beverages', 180, 'pack', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Filter Coffee', 'फिल्टर कॉफी', 'beverages', 220, 'pack', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', true, 1, 1),

  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Soap Bar', 'साबुन', 'household', 35, 'pcs', 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Detergent Powder', 'डिटर्जेंट पाउडर', 'household', 95, 'pack', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&q=80', true, 1, 1),
  ((select id from kiranas where name = 'Rakesh Kirana Store'), 'Toothpaste', 'टूथपेस्ट', 'household', 55, 'pcs', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80', true, 1, 1)
on conflict do nothing;
