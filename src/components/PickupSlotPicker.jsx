import { formatPickupSlotLabel } from '../lib/format.js'

export default function PickupSlotPicker({ slots, selectedSlot, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {slots.map((slot) => {
        const isActive = selectedSlot && slot.getTime() === selectedSlot.getTime()
        return (
          <button
            key={slot.toISOString()}
            type="button"
            onClick={() => onSelect(slot)}
            className={`rounded-full border px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-ink bg-ink text-surface'
                : 'border-border bg-surface text-ink hover:border-ink/30'
            }`}
          >
            {formatPickupSlotLabel(slot)}
          </button>
        )
      })}
    </div>
  )
}
