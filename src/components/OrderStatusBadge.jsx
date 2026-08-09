const STATUS_CONFIG = {
  pending: { label: 'Preparing your order', className: 'bg-accent-soft text-accent' },
  ready: { label: 'Ready for pickup', className: 'bg-success/10 text-success' },
  picked_up: { label: 'Picked up', className: 'bg-border text-ink-soft' },
  cancelled: { label: 'Cancelled', className: 'bg-border text-ink-muted' },
}

export default function OrderStatusBadge({ status, pulse = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${config.className} ${
        pulse ? 'animate-pulse-once' : ''
      }`}
    >
      {config.label}
    </span>
  )
}
