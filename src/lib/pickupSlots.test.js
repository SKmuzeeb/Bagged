import { describe, it, expect } from 'vitest'
import { getPickupSlots, KIRANA_OPEN_HOUR, KIRANA_CLOSE_HOUR, MAX_PICKUP_SLOTS } from './pickupSlots.js'

function at(hour, minute) {
  return new Date(2026, 2, 10, hour, minute, 0, 0) // a fixed Tuesday
}

describe('getPickupSlots', () => {
  it('returns slots at least 30 minutes from the given now', () => {
    const now = at(10, 0)
    const slots = getPickupSlots(now)

    expect(slots[0].getTime() - now.getTime()).toBeGreaterThanOrEqual(30 * 60 * 1000)
  })

  it('never returns a slot outside 7 AM – 10 PM', () => {
    const now = at(6, 0)
    const slots = getPickupSlots(now)

    slots.forEach((slot) => {
      expect(slot.getHours()).toBeGreaterThanOrEqual(KIRANA_OPEN_HOUR)
      expect(slot.getHours()).toBeLessThanOrEqual(KIRANA_CLOSE_HOUR - 1)
    })
  })

  it('returns at most 8 slots', () => {
    const slots = getPickupSlots(at(9, 0))
    expect(slots.length).toBe(MAX_PICKUP_SLOTS)
  })

  it('rolls to the next day starting at 7 AM after 9:30 PM', () => {
    const now = at(21, 30)
    const slots = getPickupSlots(now)

    const firstSlot = slots[0]
    expect(firstSlot.getDate()).toBe(now.getDate() + 1)
    expect(firstSlot.getHours()).toBe(KIRANA_OPEN_HOUR)
    expect(firstSlot.getMinutes()).toBe(0)
  })

  it('accepts an injectable `now` and produces different results for different clocks', () => {
    const morning = getPickupSlots(at(8, 0))
    const evening = getPickupSlots(at(20, 0))

    expect(morning[0].getTime()).not.toBe(evening[0].getTime())
  })
})
