import { Heart, Plus } from 'lucide-react'
import QuantityStepper from './QuantityStepper.jsx'
import { formatRupees } from '../lib/format.js'

export default function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  isFavorite = false,
  onToggleFavorite,
}) {
  const outOfStock = product.in_stock === false

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square rounded-xl bg-accent-soft overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-300 ease-out ${
              outOfStock ? 'grayscale opacity-60' : 'group-hover:scale-[1.03]'
            }`}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : null}

        {outOfStock && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/90 px-2.5 py-1 text-[11px] font-medium text-surface">
            Out of stock
          </span>
        )}

        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
            aria-pressed={isFavorite}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink transition-colors hover:bg-white/90"
          >
            <Heart
              size={15}
              strokeWidth={2}
              fill={isFavorite ? 'currentColor' : 'none'}
              className={isFavorite ? 'text-accent' : 'text-ink-soft'}
            />
          </button>
        )}

        <div className="absolute bottom-2.5 right-2.5">
          {outOfStock ? (
            <button
              type="button"
              disabled
              aria-label="Out of stock"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink-muted cursor-not-allowed"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          ) : quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              unit={product.unit}
              onIncrement={() => onIncrement(product.id)}
              onDecrement={() => onDecrement(product.id)}
              size="sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.name}`}
              className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-surface transition-colors hover:bg-accent/90"
            >
              <Plus size={13} strokeWidth={2.5} />
              Add
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-0.5">
        <h3 className="text-lg font-bold leading-snug text-ink">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm font-medium text-ink-soft">{product.description}</p>
        )}
        <p className="pt-1">
          <span className="font-mono text-lg font-bold text-ink">{formatRupees(product.price_rupees)}</span>{' '}
          <span className="font-mono text-sm font-medium text-ink-soft">/ {product.unit}</span>
        </p>
      </div>
    </div>
  )
}
