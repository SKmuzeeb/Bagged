import { apiFetch } from '../apiClient.js'

export async function listFavorites() {
  const { data } = await apiFetch('/api/favorites')
  return data
}

export function addFavorite(productId) {
  return apiFetch('/api/favorites', { method: 'POST', body: { product_id: productId } })
}

export function removeFavorite(productId) {
  return apiFetch(`/api/favorites/${productId}`, { method: 'DELETE' })
}
