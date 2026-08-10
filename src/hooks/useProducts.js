import { useEffect, useState } from 'react'
import { isApiConfigured } from '../lib/apiClient.js'
import { listProducts } from '../lib/api/products.js'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts.js'

function localProducts(kiranaId) {
  return kiranaId ? SAMPLE_PRODUCTS.filter((product) => product.kirana_id === kiranaId) : SAMPLE_PRODUCTS
}

/**
 * Fetches the product catalog from the Zippd API when configured (scoped to
 * a single kirana when `kiranaId` is given); otherwise, and on any fetch
 * failure, falls back to the local sample catalog so the shop page always
 * has something to show.
 */
export function useProducts(kiranaId) {
  const [products, setProducts] = useState(isApiConfigured ? [] : localProducts(kiranaId))
  const [loading, setLoading] = useState(isApiConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isApiConfigured) {
      setProducts(localProducts(kiranaId))
      return undefined
    }

    let cancelled = false
    setLoading(true)

    listProducts({ kiranaId })
      .then((data) => {
        if (cancelled) return
        if (!data || data.length === 0) {
          setProducts(localProducts(kiranaId))
        } else {
          setProducts(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setProducts(localProducts(kiranaId))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [kiranaId])

  return { products, loading, error }
}
