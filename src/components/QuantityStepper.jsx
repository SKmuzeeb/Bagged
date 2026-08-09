import { Minus, Plus } from 'lucide-react'
import { formatQuantity } from '../lib/format.js'

/**
 * A compact -/quantity/+ stepper. `size` controls whether it renders as the
 * small in-card control (product grid) or the larger control used in the
 * cart rows.
 */
export default function QuantityStepper({ quantity, unit, onIncrement, onDecrement, size = 'sm' }) {
  const isSmall = size === 'sm'

  return (
    <div
      className={`inline-flex items-center rounded-full bg-ink text-surface ${
        isSmall ? 'gap-2 px-1.5 py-1 text-xs' : 'gap-3 px-2.5 py-1.5 text-sm'
      }`}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${
          isSmall ? 'h-5 w-5' : 'h-7 w-7'
        }`}
      >
        <Minus size={isSmall ? 12 : 14} strokeWidth={2.5} />
      </button>
      <span className="font-medium tabular-nums min-w-[2.5rem] text-center">
        {formatQuantity(quantity, unit)}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={`flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${
          isSmall ? 'h-5 w-5' : 'h-7 w-7'
        }`}
      >
        <Plus size={isSmall ? 12 : 14} strokeWidth={2.5} />
      </button>
    </div>
  )
}
