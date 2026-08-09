// Pickup slot generation.
//
// Rules:
//  - Hourly slots, on the hour.
//  - First slot at least 30 minutes from `now`.
//  - A slot's pickup window is assumed to run for one hour, so the last
//    valid slot start is one hour before closing (closing 22:00 → last
//    slot 21:00).
//  - Never before opening.
//  - Max 8 slots returned.
//  - If there's no valid slot left today, roll to opening time the next day.

export const KIRANA_OPEN_HOUR = 7
export const KIRANA_CLOSE_HOUR = 22
export const MAX_PICKUP_SLOTS = 8
export const MIN_LEAD_MINUTES = 30

function lastValidStartHour() {
  return KIRANA_CLOSE_HOUR - 1
}

function isPastLastValidHour(date) {
  return date.getHours() > lastValidStartHour()
}

function isBeforeOpening(date) {
  return date.getHours() < KIRANA_OPEN_HOUR
}

function rollToNextValidStart(date) {
  const next = new Date(date)
  if (isPastLastValidHour(next)) {
    next.setDate(next.getDate() + 1)
    next.setHours(KIRANA_OPEN_HOUR, 0, 0, 0)
  } else if (isBeforeOpening(next)) {
    next.setHours(KIRANA_OPEN_HOUR, 0, 0, 0)
  }
  return next
}

/**
 * Returns up to MAX_PICKUP_SLOTS Date objects representing valid pickup
 * slot start times, given an injectable `now` (defaults to the real clock).
 */
export function getPickupSlots(now = new Date()) {
  let candidate = new Date(now)
  candidate.setMinutes(candidate.getMinutes() + MIN_LEAD_MINUTES)
  candidate.setSeconds(0, 0)

  // Round up to the next full hour if there's a remainder.
  if (candidate.getMinutes() > 0) {
    candidate.setHours(candidate.getHours() + 1, 0, 0, 0)
  }

  candidate = rollToNextValidStart(candidate)

  const slots = []
  while (slots.length < MAX_PICKUP_SLOTS) {
    slots.push(new Date(candidate))
    candidate = new Date(candidate)
    candidate.setHours(candidate.getHours() + 1)
    candidate = rollToNextValidStart(candidate)
  }

  return slots
}

/** The end time (one hour after start) of a pickup slot, for "walk in before X" copy. */
export function getSlotEndTime(slotStart) {
  const end = new Date(slotStart)
  end.setHours(end.getHours() + 1)
  return end
}
