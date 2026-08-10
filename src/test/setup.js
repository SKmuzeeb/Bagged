import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// Tests should never hit the real Zippd API even if VITE_API_BASE_URL is set
// in a local .env (Vite loads .env regardless of mode) — every hook/store
// already falls back to local demo data on a fetch failure, so failing fast
// here both keeps tests offline and exercises that fallback path.
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('Network calls are disabled in tests')))
  )
})
