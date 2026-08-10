import { useEffect, useState } from 'react'
import { isApiConfigured } from '../lib/apiClient.js'
import { listKiranas } from '../lib/api/kiranas.js'
import { KIRANAS as LOCAL_KIRANAS } from '../data/kiranas.js'

// The store list rarely changes and every page that needs one kirana (Shop,
// Checkout, Orders, Order Confirmation) would otherwise trigger its own
// fetch — so the full list is fetched once and shared from here.
let cachedKiranas = null
let inflight = null

function fetchKiranas() {
  if (cachedKiranas) return Promise.resolve(cachedKiranas)
  if (!inflight) {
    inflight = listKiranas()
      .then((data) => {
        cachedKiranas = data
        return data
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

/** Lists every kirana, for the Stores search page. */
export function useKiranas() {
  const [kiranas, setKiranas] = useState(isApiConfigured ? cachedKiranas ?? [] : LOCAL_KIRANAS)
  const [loading, setLoading] = useState(isApiConfigured && !cachedKiranas)

  useEffect(() => {
    if (!isApiConfigured) return undefined

    let cancelled = false
    fetchKiranas()
      .then((data) => {
        if (!cancelled) setKiranas(data)
      })
      .catch(() => {
        if (!cancelled) setKiranas(LOCAL_KIRANAS)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { kiranas, loading }
}

/** Looks up a single kirana by id, e.g. for the Shop and Checkout pages. */
export function useKirana(id) {
  const { kiranas, loading } = useKiranas()
  const kirana = id ? kiranas.find((entry) => entry.id === id) ?? null : null
  return { kirana, loading }
}
