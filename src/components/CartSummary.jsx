import { ArrowRight, Wallet } from 'lucide-react'
import { formatRupees } from '../lib/format.js'
import { MIN_ORDER_VALUE } from '../lib/orderValidation.js'

export default function CartSummary({ subtotal, onContinue }) {
  const remaining = MIN_ORDER_VALUE - subtotal
  const belowMinimum = remaining > 0

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-medium text-ink">Order summary</h2>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-ink-soft">Subtotal</span>
        <span className="font-medium text-ink">{formatRupees(subtotal)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm text-ink-soft">
        <Wallet size={15} className="flex-shrink-0" />
        <span>Pay at pickup — cash or card, in store.</span>
      </div>

      {belowMinimum && (
        <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
          Add {formatRupees(remaining)} more to reach the ₹{MIN_ORDER_VALUE} minimum order.
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={belowMinimum}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-ink-muted"
      >
        Choose pickup time
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
