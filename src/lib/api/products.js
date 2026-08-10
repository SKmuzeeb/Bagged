import { apiFetch } from '../apiClient.js'

export async function listProducts({ kiranaId } = {}) {
  const query = kiranaId ? `?kirana_id=${encodeURIComponent(kiranaId)}` : ''
  const { data } = await apiFetch(`/api/products${query}`, { auth: false })
  return data
}

export function getProduct(id) {
  return apiFetch(`/api/products/${id}`, { auth: false })
}
