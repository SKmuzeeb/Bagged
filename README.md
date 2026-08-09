# Tayaar

A click-and-collect platform for local Indian kirana (neighborhood grocery) stores. Customers browse a kirana's products, order ahead, and pick up in-store at a chosen time. No delivery.

**Product philosophy:** don't replace the kirana relationship — remove the wait.

This is a portfolio-grade demo built around one seeded kirana ("Rakesh Kirana Store," Gachibowli, Hyderabad) with realistic mock data and no real payments.

## Design philosophy

Editorial, photographic, and unhurried — closer to a well-designed cookbook than a supermarket app. No gradients, no glassmorphism, no emojis, no stock illustration. One accent color (warm coral) used sparingly against warm neutrals; `Fraunces` for display type, `Inter` for everything else. Desktop-first, responsive down to tablet (768px); mobile works but isn't the priority.

## Tech stack

- **React 18 + Vite** (JavaScript)
- **Tailwind CSS** with a custom theme (colors, fonts, container, animation — see `tailwind.config.js`)
- **React Router v6** for routing
- **Zustand** (persisted to `localStorage`) for cart and auth state
- **Supabase** (Postgres + Auth) for the database and email magic-link sign-in — optional, see Fallback mode below
- **lucide-react** for icons
- **Vitest + React Testing Library** for tests
- Deploy target: **Vercel**

## Fallback / demo mode — this is the important part

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set, Tayaar runs entirely on local data:

- Products come from `src/data/sampleProducts.js` (30 items, same catalog as `supabase/seed.sql`).
- Orders are created, read, and updated in the browser's `localStorage` instead of Supabase.
- Sign-in simulates the "check your inbox" flow without sending anything.

This means **browsing, cart, checkout, and order placement all work the moment you run `npm install && npm run dev`** — no database setup required. Every data-access module (`useProducts`, `useOrders`, `authStore`) checks `isSupabaseConfigured` first and transparently falls back, including mid-session if a Supabase write ever fails.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. That's it — the app is fully interactive in demo mode.

### Connecting Supabase (optional)

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev`. Products now load from Supabase; orders write to Supabase (RLS-scoped to the signed-in user) instead of `localStorage`.

Sign-in uses Supabase's email magic link (`signInWithOtp`) — no password, ever.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest suite once (or in watch mode interactively) |
| `npm run test:ui` | Run tests with the Vitest UI |

## Tests

```bash
npm test
```

Covers:

- `src/store/cartStore.test.js` — add/remove/step/out-of-stock/localStorage persistence
- `src/lib/pickupSlots.test.js` — hourly slot generation, 30-min lead time, 7 AM–10 PM bounds, 8-slot cap, next-day rollover after 9:30 PM
- `src/lib/orderValidation.test.js` — minimum order value, empty cart, missing pickup slot
- `src/components/ProductCard.test.jsx` — rendering, add handler payload, out-of-stock state, stepper
- `src/pages/Cart.test.jsx` — empty state, item rendering, total recalculation, minimum-order gating

## Business logic reference

- **Single-vendor cart** — the demo has one kirana; adding a product from a different kirana would replace the cart (single-vendor by design).
- **Quantity steps** — 0.25 for kg/l items, 1 for pcs/pack items (see `src/data/sampleProducts.js` for the mapping, e.g. eggs at `min_order_qty: 6`).
- **Minimum order** — ₹100, enforced client-side in `src/lib/orderValidation.js` and reflected inline in the cart summary.
- **Pickup slots** — hourly, first slot ≥ 30 minutes out, last slot start one hour before closing, capped at 8 slots, rolling to next-day 7 AM after 9:30 PM (`src/lib/pickupSlots.js`).
- **Order lifecycle** — `pending → ready → picked_up`, or `cancelled` (only while `pending`). On the order confirmation page, status auto-advances from `pending` to `ready` after 20 seconds via `setTimeout` — **this is a demo stand-in only**; in production the kirana would update this themselves.
- **Reorder** — re-adds a past order's items at *current* stock and pricing, surfacing a toast if anything changed or is no longer available.

## Deployment (Vercel)

```bash
npm run build
```

Push to a Git repo and import it in Vercel, or run `vercel` from the project root. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables if you want the deployed app to use a real Supabase project — otherwise it deploys straight into demo mode.

---

Built with React, Vite, Tailwind CSS, and Supabase.
