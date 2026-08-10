import { apiFetch } from '../apiClient.js'

export async function listKiranas({ city } = {}) {
  const query = city ? `?city=${encodeURIComponent(city)}` : ''
  const { data } = await apiFetch(`/api/kiranas${query}`, { auth: false })
  return data
}

export function getKirana(id) {
  return apiFetch(`/api/kiranas/${id}`, { auth: false })
}
