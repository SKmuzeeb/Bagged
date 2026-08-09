import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { getOrderById, updateOrderStatus } from '../hooks/useOrders.js'
import { formatClockTime, formatRupees } from '../lib/format.js'
import { getSlotEndTime } from '../lib/pickupSlots.js'
import { KIRANA } from '../data/kirana.js'
import OrderStatusBadge from '../components/OrderStatusBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'

// Demo-only: in production the kirana would mark the order ready, not a
// timer in the browser.
const DEMO_READY_DELAY_MS = 20000

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [justBecameReady, setJustBecameReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getOrderById(id).then((data) => {
      if (!cancelled) {
        setOrder(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!order || order.status !== 'pending') return undefined

    const timer = setTimeout(async () => {
      await updateOrderStatus(order.id, 'ready')
      setOrder((current) => (current ? { ...current, status: 'ready' } : current))
      setJustBecameReady(true)
    }, DEMO_READY_DELAY_MS)

    return () => clearTimeout(timer)
  }, [order])

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 lg:px-12">
        <div className="mx-auto h-10 w-64 animate-pulse rounded bg-border" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-content px-5 md:px-8 lg:px-12">
        <EmptyState
          title="Order not found"
          message="We couldn't find that order — it may have been on a different device."
          actionLabel="Browse products"
          actionTo="/shop"
        />
      </div>
    )
  }

  const items = order.items || order.order_items || []
  const pickupSlot = new Date(order.pickup_slot)
  const pickupSlotEnd = getSlotEndTime(pickupSlot)

  return (
    <div className="mx-auto max-w-content px-5 py-14 md:px-8 lg:px-12">
      <OrderStatusBadge status={order.status} pulse={justBecameReady} />

      <h1 className="mt-6 font-display text-5xl font-medium leading-tight text-ink sm:text-6xl">
        Order confirmed
      </h1>
      <p className="mt-2 text-ink-soft">Order #{order.id}</p>

      {order.status === 'ready' && (
        <div className="mt-6 rounded-xl bg-success/10 px-5 py-4 text-sm text-success">
          Walk in anytime before {formatClockTime(pickupSlotEnd)}.
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-medium text-ink">Your items</h2>
          <div className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <div key={item.productId || item.product_id || item.name} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink">
                  {item.name} <span className="text-ink-soft">× {item.quantity}{item.unit}</span>
                </span>
                <span className="font-medium text-ink">{formatRupees(item.price_rupees * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-medium text-ink">Total</span>
            <span className="text-lg font-semibold text-ink">{formatRupees(order.total)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink">Pickup</h2>
            <p className="mt-2 text-2xl font-medium text-ink">{formatClockTime(pickupSlot)}</p>
            <div className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
              <MapPin size={15} className="mt-0.5 flex-shrink-0" />
              <span>{KIRANA.address}</span>
            </div>
            <a
              href={`tel:${KIRANA.phone.replace(/\s+/g, '')}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent"
            >
              <Phone size={15} />
              {KIRANA.phone}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-ink-soft">
              <MessageCircle size={14} />
              Message from {KIRANA.owner_name.split(' ')[0]} ji
            </div>
            <p className="rounded-xl rounded-tl-sm bg-bg px-4 py-3 text-sm text-ink">
              Namaste! Aap ka order {formatClockTime(pickupSlot)} tak teyar ho jayega. — {KIRANA.owner_name.split(' ')[0]} ji
            </p>
          </div>
        </div>
      </div>

      <Link to="/orders" className="mt-10 inline-block text-sm font-medium text-accent hover:underline">
        View all orders →
      </Link>
    </div>
  )
}
