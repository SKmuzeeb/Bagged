export const MIN_ORDER_VALUE = 100

/**
 * Validates a would-be order before it's created.
 * Returns { valid: true, errors: [], order } or { valid: false, errors }.
 */
export function validateOrder({ items, total, pickupSlot }) {
  const errors = []

  if (!items || items.length === 0) {
    errors.push('Your bag is empty.')
  }

  if (typeof total !== 'number' || Number.isNaN(total) || total < MIN_ORDER_VALUE) {
    errors.push(`Minimum order value is ₹${MIN_ORDER_VALUE}.`)
  }

  if (!pickupSlot) {
    errors.push('Please choose a pickup time.')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    order: {
      items,
      total,
      pickup_slot: pickupSlot,
      status: 'pending',
      payment_method: 'pay_at_pickup',
    },
  }
}
