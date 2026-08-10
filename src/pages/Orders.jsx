import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useOrders, updateOrderStatus } from '../hooks/useOrders.js'
import { useProducts } from '../hooks/useProducts.js'
import { useCartStore } from '../store/cartStore.js'
import { formatClockTime, formatOrderDate, formatRupees } from '../lib/format.js'
import { useKirana } from '../hooks/useKiranas.js'
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
  const { kirana } = useKirana(order.kirana_id)

  return (
    <div className="rounded-3xl border-2 border-border bg-surface p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-manrope text-lg font-bold text-ink">{kirana?.name ?? 'Kirana store'}</p>
          <p className="mt-1 font-manrope text-sm font-medium text-ink-soft">
            Pickup {formatOrderDate(order.pickup_slot)}, {formatClockTime(order.pickup_slot)}
          </p>
          <p className="mt-1 truncate font-manrope text-sm font-medium text-ink-soft">{itemsSummary}</p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4">
          <span className="font-mono text-lg font-extrabold text-ink">{formatRupees(order.total)}</span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t-2 border-border pt-4">
        <Link
          to={`/order/${order.id}`}
          className="font-manrope text-sm font-bold text-accent hover:underline"
        >
          View details
        </Link>
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => onCancel(order.id)}
            className="font-manrope text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Cancel order
          </button>
        )}
        {(order.status === 'picked_up' || order.status === 'cancelled') && (
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="rounded-full border-2 border-border px-4 py-1.5 font-manrope text-sm font-bold text-ink transition-colors hover:border-ink"
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
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-border" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-3xl bg-border" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <EmptyState
            title="No orders yet"
            message="Once you place an order, you'll be able to track it here."
            actionLabel="Find a store"
            actionTo="/stores"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12">
        <h1 className="mb-8 font-manrope text-4xl font-extrabold tracking-tight text-ink">My orders</h1>

        {activeOrders.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-manrope text-sm font-bold uppercase tracking-wider text-ink-muted">
              Active
            </h2>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} onCancel={handleCancel} onReorder={handleReorder} />
              ))}
            </div>
          </section>
        )}

        {pastOrders.length > 0 && (
          <section>
            <h2 className="mb-4 font-manrope text-sm font-bold uppercase tracking-wider text-ink-muted">
              Past
            </h2>
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <OrderCard key={order.id} order={order} onCancel={handleCancel} onReorder={handleReorder} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
