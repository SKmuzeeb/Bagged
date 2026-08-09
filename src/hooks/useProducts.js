import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts.js'

/**
 * Fetches the product catalog from Supabase when configured; otherwise
 * (and on any fetch failure) falls back to the local sample catalog so the
 * shop page always has something to show.
 */
export function useProducts() {
  const [products, setProducts] = useState(isSupabaseConfigured ? [] : SAMPLE_PRODUCTS)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let cancelled = false
    setLoading(true)

    supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return
        if (fetchError || !data || data.length === 0) {
          setError(fetchError?.message ?? null)
          setProducts(SAMPLE_PRODUCTS)
        } else {
          setProducts(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setProducts(SAMPLE_PRODUCTS)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, error }
}
