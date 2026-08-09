export function formatRupees(amount) {
  const value = Number(amount) || 0
  const hasFraction = Math.abs(value % 1) > 0.001
  return `₹${value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: hasFraction ? 2 : 0,
  })}`
}

export function formatQuantity(quantity, unit) {
  const q = Number(quantity) || 0
  const label = Number.isInteger(q) ? String(q) : q.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  return `${label} ${unit}`
}

export function formatClockTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatPickupSlotLabel(date) {
  const d = new Date(date)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  const time = formatClockTime(d)
  return isToday ? time : `Tomorrow, ${time}`
}

export function formatOrderDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
