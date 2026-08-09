import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ChevronDown, Phone } from 'lucide-react'
import { useCartStore } from '../store/cartStore.js'
import { createOrder } from '../hooks/useOrders.js'
import { validateOrder } from '../lib/orderValidation.js'
import { getPickupSlots } from '../lib/pickupSlots.js'
import { formatRupees } from '../lib/format.js'
import { KIRANA } from '../data/kirana.js'
import { showToast } from '../components/Toast.jsx'
import PickupSlotPicker from '../components/PickupSlotPicker.jsx'

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.getTotal())
  const clearCart = useCartStore((state) => state.clearCart)

  const slots = useMemo(() => getPickupSlots(), [])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  async function handleConfirm() {
    const validation = validateOrder({ items, total, pickupSlot: selectedSlot })
    if (!validation.valid) {
      showToast(validation.errors[0], 'error')
      return
    }

    setSubmitting(true)
    try {
      const order = await createOrder({
        kirana_id: KIRANA.id,
        pickup_slot: selectedSlot.toISOString(),
        total,
        items,
        payment_method: 'pay_at_pickup',
      })
      clearCart()
      navigate(`/order/${order.id}`)
    } catch {
      showToast('Something went wrong placing your order. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-content px-5 pb-32 pt-10 md:px-8 lg:px-12">
      <button
        type="button"
        onClick={() => setSummaryOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-6 py-4 text-left"
      >
        <span className="text-sm font-medium text-ink">
          {items.length} item{items.length === 1 ? '' : 's'} · {formatRupees(total)}
        </span>
        <ChevronDown size={16} className={`text-ink-soft transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
      </button>

      {summaryOpen && (
        <div className="mt-2 divide-y divide-border rounded-2xl border border-border bg-surface px-6">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ink">
                {item.name} <span className="text-ink-soft">× {item.quantity}{item.unit}</span>
              </span>
              <span className="font-medium text-ink">{formatRupees(item.price_rupees * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <h1 className="mb-6 mt-10 font-display text-3xl font-medium text-ink">Choose your pickup time</h1>
      <PickupSlotPicker slots={slots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium text-ink">{KIRANA.name}</h2>
        <p className="mt-2 text-sm text-ink-soft">{KIRANA.address}</p>
        <a
          href={`tel:${KIRANA.phone.replace(/\s+/g, '')}`}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent"
        >
          <Phone size={15} />
          {KIRANA.phone}
        </a>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 md:px-8 lg:px-12">
          <div>
            <p className="text-xs text-ink-soft">Total</p>
            <p className="text-lg font-semibold text-ink">{formatRupees(total)}</p>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSlot || submitting}
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-ink-muted"
          >
            {submitting ? 'Confirming…' : 'Confirm order'}
          </button>
        </div>
      </div>
    </div>
  )
}
