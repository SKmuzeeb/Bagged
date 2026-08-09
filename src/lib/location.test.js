import { describe, it, expect } from 'vitest'
import { getNearestCity, AVAILABLE_CITIES } from './location.js'

describe('getNearestCity', () => {
  it('resolves coordinates inside a city to that same city', () => {
    // Central Hyderabad
    expect(getNearestCity(17.385, 78.4867)).toBe('Hyderabad')
  })

  it('resolves coordinates near Bangalore to Bangalore, not a farther city', () => {
    // Koramangala, Bangalore — close to but not exactly the city-center point
    expect(getNearestCity(12.9352, 77.6146)).toBe('Bangalore')
  })

  it('always returns one of the cities that actually has a store', () => {
    // Somewhere in central India, roughly equidistant from several cities
    const result = getNearestCity(21.1458, 79.0882)
    expect(AVAILABLE_CITIES).toContain(result)
  })
})
