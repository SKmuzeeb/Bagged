import { X } from 'lucide-react'
import QuantityStepper from './QuantityStepper.jsx'
import { formatRupees } from '../lib/format.js'

export default function CartRow({ item, onIncrement, onDecrement, onRemove }) {
  const lineTotal = item.quantity * item.price_rupees

  return (
    <div className="flex items-center gap-4 border-b border-border py-5 last:border-none">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-accent-soft">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-medium text-ink">{item.name}</h3>
        <p className="text-sm text-ink-soft">
          {formatRupees(item.price_rupees)} / {item.unit}
        </p>
      </div>

      <QuantityStepper
        quantity={item.quantity}
        unit={item.unit}
        onIncrement={() => onIncrement(item.productId)}
        onDecrement={() => onDecrement(item.productId)}
        size="md"
      />

      <p className="w-20 flex-shrink-0 text-right text-base font-semibold text-ink">
        {formatRupees(lineTotal)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        aria-label={`Remove ${item.name}`}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-border hover:text-ink"
      >
        <X size={16} />
      </button>
    </div>
  )
}
