import { KIRANAS } from '../data/kiranas.js'

// Approximate city-center coordinates. There's no maps API in this demo, so
// "nearest city" is resolved locally by straight-line distance to this
// short list rather than a real reverse-geocoding lookup.
const CITY_COORDINATES = {
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
}

// Every city a kirana actually exists in — what a customer is allowed to pick.
export const AVAILABLE_CITIES = [...new Set(KIRANAS.map((kirana) => kirana.city))]

function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

// Great-circle distance between two lat/lon points, in kilometers.
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS_KM = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Given a real lat/lon (e.g. from the browser's Geolocation API), returns
 * whichever of AVAILABLE_CITIES is geographically closest.
 */
export function getNearestCity(lat, lon) {
  let nearestCity = null
  let shortestDistance = Infinity

  for (const city of AVAILABLE_CITIES) {
    const coords = CITY_COORDINATES[city]
    if (!coords) continue
    const distance = haversineDistanceKm(lat, lon, coords.lat, coords.lon)
    if (distance < shortestDistance) {
      shortestDistance = distance
      nearestCity = city
    }
  }

  return nearestCity
}
