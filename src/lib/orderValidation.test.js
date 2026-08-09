import { describe, it, expect } from 'vitest'
import { validateOrder, MIN_ORDER_VALUE } from './orderValidation.js'

const sampleItems = [{ productId: 'p1', name: 'Rice', price_rupees: 120, unit: 'kg', quantity: 1 }]
const pickupSlot = new Date(2026, 2, 10, 11, 0)

describe('validateOrder', () => {
  it('rejects a total below the minimum order value', () => {
    const result = validateOrder({ items: sampleItems, total: MIN_ORDER_VALUE - 1, pickupSlot })

    expect(result.valid).toBe(false)
    expect(result.errors.some((message) => message.includes(String(MIN_ORDER_VALUE)))).toBe(true)
  })

  it('rejects an empty cart', () => {
    const result = validateOrder({ items: [], total: 500, pickupSlot })

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Your bag is empty.')
  })

  it('rejects a missing pickup slot', () => {
    const result = validateOrder({ items: sampleItems, total: 500, pickupSlot: null })

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Please choose a pickup time.')
  })

  it('passes for a valid order and returns the expected shape', () => {
    const result = validateOrder({ items: sampleItems, total: 500, pickupSlot })

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.order).toEqual({
      items: sampleItems,
      total: 500,
      pickup_slot: pickupSlot,
      status: 'pending',
      payment_method: 'pay_at_pickup',
    })
  })
})
