import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useOrders, updateOrderStatus } from '../hooks/useOrders.js'
import { useProducts } from '../hooks/useProducts.js'
import { useCartStore } from '../store/cartStore.js'
import { formatClockTime, formatOrderDate, formatRupees } from '../lib/format.js'
import { KIRANA } from '../data/kirana.js'
import { showToast } from '../components/Toast.jsx'
import OrderStatusBadge from '../components/OrderStatusBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'

const ACTIVE_STATUSES = new Set(['pending', 'ready'])

function sortByPickupDesc(a, b) {
  return new Date(b.pickup_slot).getTime() - new Date(a.pickup_slot).getTime()
}

function OrderCard({ order, onCancel, onReorder }) {
  const items = order.items || order.order_items || []
  const itemsSummary = items.map((item) => item.name).join(', ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-display text-lg font-medium text-ink">{KIRANA.name}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Pickup {formatOrderDate(order.pickup_slot)}, {formatClockTime(order.pickup_slot)}
          </p>
          <p className="mt-1 truncate text-sm text-ink-soft">{itemsSummary}</p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4">
          <span className="text-lg font-semibold text-ink">{formatRupees(order.total)}</span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
        <Link to={`/order/${order.id}`} className="text-sm font-medium text-accent hover:underline">
          View details
        </Link>
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => onCancel(order.id)}
            className="text-sm text-ink-soft transition-colors hover:text-ink"
          >
            Cancel order
          </button>
        )}
        {(order.status === 'picked_up' || order.status === 'cancelled') && (
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink/30"
          >
            Reorder
          </button>
        )}
      </div>
    </div>
  )
}

export default function Orders() {
  const { orders, loading, refresh } = useOrders()
  const { products } = useProducts()
  const addItem = useCartStore((state) => state.addItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const navigate = useNavigate()

  const { activeOrders, pastOrders } = useMemo(() => {
    const active = orders.filter((order) => ACTIVE_STATUSES.has(order.status)).sort(sortByPickupDesc)
    const past = orders.filter((order) => !ACTIVE_STATUSES.has(order.status)).sort(sortByPickupDesc)
    return { activeOrders: active, pastOrders: past }
  }, [orders])

  async function handleCancel(orderId) {
    await updateOrderStatus(orderId, 'cancelled')
    refresh()
  }

  function handleReorder(order) {
    const orderItems = order.items || order.order_items || []
    let priceChanged = 0
    let unavailable = 0

    orderItems.forEach((item) => {
      const productId = item.productId || item.product_id
      const currentProduct = products.find((p) => p.id === productId)

      if (!currentProduct || currentProduct.in_stock === false) {
        unavailable += 1
        return
      }
      if (Number(currentProduct.price_rupees) !== Number(item.price_rupees)) {
        priceChanged += 1
      }

      const added = addItem(currentProduct)
      if (added) {
        setQuantity(currentProduct.id, item.quantity)
      }
    })

    const messages = []
    if (priceChanged > 0) {
      messages.push(`${priceChanged} item${priceChanged > 1 ? 's' : ''} updated to current prices`)
    }
    if (unavailable > 0) {
      messages.push(`${unavailable} item${unavailable > 1 ? 's' : ''} no longer available`)
    }
    showToast(messages.length > 0 ? messages.join(' · ') : 'Items added to your bag.', messages.length > 0 ? 'info' : 'success')

    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-5 py-12 md:px-8 lg:px-12">
        <div className="h-8 w-40 animate-pulse rounded bg-border" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-border" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-12">
        <EmptyState
          title="No orders yet"
          message="Once you place an order, you'll be able to track it here."
          actionLabel="Browse products"
          actionTo="/shop"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-content px-5 py-12 md:px-8 lg:px-12">
      <h1 className="mb-8 font-display text-4xl font-medium text-ink">My orders</h1>

      {activeOrders.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-ink-soft">Active</h2>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} onReorder={handleReorder} />
            ))}
          </div>
        </section>
      )}

      {pastOrders.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-ink-soft">Past</h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} onReorder={handleReorder} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
