const STATUS_CONFIG = {
  pending: { label: 'Preparing your order', className: 'bg-accent-soft text-accent' },
  ready: { label: 'Ready for pickup', className: 'bg-electric text-ink' },
  picked_up: { label: 'Picked up', className: 'bg-success text-white' },
  cancelled: { label: 'Cancelled', className: 'bg-ink-muted text-white' },
}

export default function OrderStatusBadge({ status, pulse = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${config.className} ${
        pulse ? 'animate-pulse-once' : ''
      }`}
    >
      {config.label}
    </span>
  )
}
