import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// The app never configures Supabase in tests (VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY are unset), so `isSupabaseConfigured` is false and
// this mock is never actually invoked — it exists as a safety net so an
// accidental import of `@supabase/supabase-js` never hits the network.
vi.mock('@supabase/supabase-js', () => {
  const chain = {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    order: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    then: (resolve) => resolve({ data: [], error: null }),
  }

  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => chain),
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        signInWithOtp: vi.fn(() => Promise.resolve({ error: null })),
        signOut: vi.fn(() => Promise.resolve({ error: null })),
      },
    })),
  }
})
