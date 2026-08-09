import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useProducts } from '../hooks/useProducts.js'
import { useCartStore } from '../store/cartStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'
import { CATEGORIES } from '../data/categories.js'
import { getKiranaById } from '../data/kiranas.js'
import { getPickupSlots } from '../lib/pickupSlots.js'
import { formatClockTime, formatRupees } from '../lib/format.js'
import { showToast } from '../components/Toast.jsx'
import CategorySidebar from '../components/CategorySidebar.jsx'
import CategoryChipsMobile from '../components/CategoryChipsMobile.jsx'
import SearchBar from '../components/SearchBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SkeletonProductCard from '../components/SkeletonProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

function usePickupIndicator() {
  return useMemo(() => {
    const [nextSlot] = getPickupSlots()
    if (!nextSlot) return null
    const orderBy = new Date(nextSlot)
    orderBy.setMinutes(orderBy.getMinutes() - 30)
    return `Order by ${formatClockTime(orderBy)} for ${formatClockTime(nextSlot)} pickup`
  }, [])
}

export default function Shop() {
  const { kiranaId } = useParams()
  const kirana = getKiranaById(kiranaId)

  const { products: allProducts, loading } = useProducts()
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.getTotal())
  const addItem = useCartStore((state) => state.addItem)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const favoriteIds = useFavoritesStore((state) => state.productIds)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const [activeCategory, setActiveCategory] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [query, setQuery] = useState('')

  const pickupIndicator = usePickupIndicator()

  const storeProducts = useMemo(
    () => allProducts.filter((product) => product.kirana_id === kiranaId),
    [allProducts, kiranaId]
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return storeProducts.filter((product) => {
      if (activeCategory !== 'all' && product.category !== activeCategory) return false
      if (inStockOnly && product.in_stock === false) return false
      if (normalizedQuery) {
        const haystack = `${product.name} ${product.description ?? ''}`.toLowerCase()
        if (!haystack.includes(normalizedQuery)) return false
      }
      return true
    })
  }, [storeProducts, activeCategory, inStockOnly, query])

  function quantityFor(productId) {
    return items.find((item) => item.productId === productId)?.quantity ?? 0
  }

  function handleAdd(product) {
    const added = addItem(product)
    if (!added) {
      showToast(`${product.name} is out of stock right now.`, 'error')
    }
  }

  if (!kirana) {
    return (
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-12">
        <EmptyState
          title="Store not found"
          message="That kirana doesn't exist, or the link is out of date."
          actionLabel="Find a store"
          actionTo="/stores"
        />
      </div>
    )
  }

  return (
    <div>
      <div className="sticky top-20 z-30 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8 lg:px-12">
          <div>
            <Link to="/stores" className="text-xs font-medium text-ink-soft transition-colors hover:text-ink">
              ← All stores
            </Link>
            <p className="text-lg font-bold text-ink">{kirana.name}</p>
            {pickupIndicator && <p className="text-sm text-ink-soft">{pickupIndicator}</p>}
          </div>
          {items.length > 0 && (
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
            >
              <ShoppingBag size={15} />
              {items.length} item{items.length === 1 ? '' : 's'} · {formatRupees(total)}
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-content px-5 py-10 md:px-8 lg:px-12">
        <CategoryChipsMobile
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="flex flex-col gap-10 lg:flex-row">
          <CategorySidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            inStockOnly={inStockOnly}
            onToggleInStock={() => setInStockOnly((value) => !value)}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-8 max-w-md">
              <SearchBar value={query} onChange={setQuery} />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonProductCard key={index} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                message="Try a different search term or category."
              />
            ) : (
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={quantityFor(product.id)}
                    onAdd={handleAdd}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    isFavorite={favoriteIds.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
