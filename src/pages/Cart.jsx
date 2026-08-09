import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore.js'
import CartRow from '../components/CartRow.jsx'
import CartSummary from '../components/CartSummary.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Cart() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.getTotal())
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const removeItem = useCartStore((state) => state.removeItem)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-12">
        <EmptyState
          title="Your bag is empty"
          message="Find something good from your local kirana."
          actionLabel="Browse products"
          actionTo="/stores"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-content px-5 py-12 md:px-8 lg:px-12">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-ink lowercase">your bag.</h1>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 lg:w-[60%]">
          <div className="rounded-2xl border border-border bg-surface px-6">
            {items.map((item) => (
              <CartRow
                key={item.productId}
                item={item}
                onIncrement={incrementItem}
                onDecrement={decrementItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:sticky lg:top-28 lg:w-[40%]">
          <CartSummary subtotal={total} onContinue={() => navigate('/checkout')} />
        </div>
      </div>
    </div>
  )
}
